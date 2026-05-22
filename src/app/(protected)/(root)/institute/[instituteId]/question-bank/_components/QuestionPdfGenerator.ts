"use client";

import type { QBQuestion } from "@/actions/question_bank_actions";

type JsPDFType = InstanceType<typeof import("jspdf").default>;

const PAGE_W = 210;
const PAGE_H = 297;
const ML = 14;
const MR = 14;
const MT = 16;
const MB = 20;
const IW = PAGE_W - ML - MR;
const OPTION_LABELS = ["(A)", "(B)", "(C)", "(D)"];

export interface QuestionPdfMeta {
  subject?: string;
  standard?: string;
  title?: string;
  /** Finest-grained filter label: subtopic name > topic name > chapter name */
  filterLabel?: string;
  /** Institute doc logo URL */
  logoUrl?: string;
  /** Institute name (shown when no logo) */
  instituteName?: string;
}

function sanitize(text: string): string {
  // jsPDF's built-in Helvetica only supports Latin-1 (ISO 8859-1).
  // Replace HTML entities and Unicode symbols with ASCII-safe equivalents
  // so that splitTextToSize computes widths correctly and text stays within margins.
  let t = (text ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&minus;/g, "-")
    .replace(/&times;/g, "x")
    .replace(/&divide;/g, "/")
    .replace(/&plusmn;/g, "+/-")
    .replace(/&alpha;/g, "alpha")
    .replace(/&beta;/g, "beta")
    .replace(/&gamma;/g, "gamma")
    .replace(/&theta;/g, "theta")
    .replace(/&pi;/g, "pi")
    .replace(/&omega;/g, "omega")
    .replace(/&mu;/g, "mu")
    .replace(/&sigma;/g, "sigma")
    .replace(/&lambda;/g, "lambda")
    .replace(/&Delta;/g, "Delta")
    .replace(/&radic;/g, "sqrt")
    .replace(/&infin;/g, "inf")
    .replace(/&ge;/g, ">=")
    .replace(/&le;/g, "<=")
    .replace(/&ne;/g, "!=")
    .replace(/&deg;/g, " deg")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, "\"")
    .replace(/&rdquo;/g, "\"")
    .replace(/&bull;/g, "*")
    .replace(/&hellip;/g, "...")
    .replace(/&([a-zA-Z]+);/g, " ")
    .replace(/<[^>]+>/g, "")
    .trim();

  // Decode numeric HTML entities to their char, then replace non-Latin-1 with ASCII
  t = t
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#([0-9]+);/g, (_, dec: string) =>
      String.fromCodePoint(parseInt(dec, 10))
    );

  // Strip any remaining character outside Latin-1 range (>255) with a safe fallback
  t = t.replace(/[^\x00-\xFF]/g, (ch) => {
    const code = ch.codePointAt(0) ?? 0;
    return mapUnicode(code);
  });

  return t;
}

function mapUnicode(code: number): string {
  switch (code) {
    case 0x2212: return "-";
    case 0x03B1: return "alpha";
    case 0x03B2: return "beta";
    case 0x03B3: return "gamma";
    case 0x03B8: return "theta";
    case 0x03C0: return "pi";
    case 0x03C9: return "omega";
    case 0x03BC: return "mu";
    case 0x03C3: return "sigma";
    case 0x03BB: return "lambda";
    case 0x0394: return "Delta";
    case 0x221A: return "sqrt";
    case 0x221E: return "inf";
    case 0x2265: return ">=";
    case 0x2264: return "<=";
    case 0x2260: return "!=";
    case 0x2192: return "->";
    case 0x2190: return "<-";
    case 0x2013: return "-";
    case 0x2014: return "-";
    case 0x2018: return "'";
    case 0x2019: return "'";
    case 0x201C: return "\"";
    case 0x201D: return "\"";
    default: break;
  }
  // Superscript digits
  if (code >= 0x2070 && code <= 0x2079) {
    const superMap: Record<number, number> = {
      0x2070: 0, 0x2074: 4, 0x2075: 5, 0x2076: 6,
      0x2077: 7, 0x2078: 8, 0x2079: 9,
    };
    const d = superMap[code];
    return d !== undefined ? "^" + d : "";
  }
  // Subscript digits
  if (code >= 0x2080 && code <= 0x2089) {
    return "_" + (code - 0x2080);
  }
  return "";
}

async function loadImageAsDataUrl(url: string): Promise<string | null> {
  const toDataUrl = async (input: string) => {
    const res = await fetch(input);
    if (!res.ok) throw new Error("Image fetch failed");
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("FileReader failed"));
      reader.readAsDataURL(blob);
    });
  };

  // Always try the proxy first (avoids CORS issues with S3/external images)
  try {
    const proxied = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    return await toDataUrl(proxied);
  } catch {
    try {
      return await toDataUrl(url);
    } catch {
      return null;
    }
  }
}

function getImageFormat(dataUrl: string): "PNG" | "JPEG" | "WEBP" {
  const m = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/i)?.[1]?.toLowerCase();
  if (m?.includes("png")) return "PNG";
  if (m?.includes("webp")) return "WEBP";
  return "JPEG";
}

function drawPageHeader(
  doc: JsPDFType,
  logoData: string | null,
  meta: QuestionPdfMeta,
  headerH: number
) {
  const y = MT;

  // Institute logo — top-left
  if (logoData) {
    const fmt = getImageFormat(logoData);
    const logoH = headerH - 4;
    const logoW = logoH * 1.5;
    doc.addImage(logoData, fmt, ML, y, logoW, logoH);
  } else if (meta.instituteName) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.text(meta.instituteName, ML, y + 4);
  }

  // Filter label — top-center
  if (meta.filterLabel) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const maxLabelW = IW - 50; // leave space for logo on left
    let label = meta.filterLabel;
    while (doc.getTextWidth(label) > maxLabelW && label.length > 10) {
      label = label.slice(0, -4) + "...";
    }
    doc.text(label, PAGE_W / 2, y + 4, { align: "center" });
    if (meta.subject || meta.standard) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100);
      const sub = [meta.subject, meta.standard ? `Class ${meta.standard}` : ""]
        .filter(Boolean)
        .join(" | ");
      doc.text(sub, PAGE_W / 2, y + 9, { align: "center" });
    }
  } else {
    // Fallback: subject + standard
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const label = [meta.subject, meta.standard ? `Class ${meta.standard}` : ""]
      .filter(Boolean)
      .join(" | ");
    if (label) doc.text(label, PAGE_W / 2, y + 4, { align: "center" });
  }

  doc.setTextColor(0);
  doc.setDrawColor(180);
  doc.setLineWidth(0.3);
  doc.line(ML, y + headerH, ML + IW, y + headerH);
}

function drawPageFooter(doc: JsPDFType, pageNum: number, totalPages: number) {
  const y = PAGE_H - 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text("Leadlly", ML, y);
  doc.text(`Page ${pageNum} / ${totalPages}`, PAGE_W / 2, y, { align: "center" });
  doc.text(new Date().toLocaleDateString("en-IN"), PAGE_W - MR, y, { align: "right" });
  doc.setTextColor(0);
}

function wrapLines(doc: JsPDFType, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

export async function generateQuestionBankPdf(
  questions: QBQuestion[],
  meta: QuestionPdfMeta
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const title = meta.title || "Question Bank";

  // Load institute logo
  let logoData: string | null = null;
  if (meta.logoUrl) {
    logoData = await loadImageAsDataUrl(meta.logoUrl);
  }

  // Pre-load all question images
  const questionImageCache = new Map<string, string | null>();
  const allImageUrls: string[] = [];
  for (const q of questions) {
    for (const img of q.images ?? []) {
      if (img.url) allImageUrls.push(img.url);
    }
  }
  await Promise.all(
    allImageUrls.map(async (url) => {
      if (!questionImageCache.has(url)) {
        questionImageCache.set(url, await loadImageAsDataUrl(url));
      }
    })
  );

  const HEADER_H = 16; // mm reserved at top for logo/title row
  const contentTop = MT + HEADER_H + 4;

  let curY = contentTop;
  let pageNum = 1;

  const newPage = () => {
    doc.addPage();
    pageNum++;
    curY = contentTop;
    // Draw header on new page
    drawPageHeader(doc, logoData, meta, HEADER_H);
  };

  const ensureSpace = (needed: number) => {
    if (curY + needed > PAGE_H - MB) {
      newPage();
    }
  };

  // Draw header on first page
  drawPageHeader(doc, logoData, meta, HEADER_H);

  // Use slightly reduced width for wrapping to prevent edge clipping
  const WRAP_W = IW - 2;

  // ── Questions ───────────────────────────────────────────────────────────────
  for (let qi = 0; qi < questions.length; qi++) {
    const q = questions[qi];
    const qNum = qi + 1;
    const qText = sanitize(q.question);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const qLines = wrapLines(doc, `${qNum}. ${qText}`, WRAP_W);

    const qImages = (q.images ?? [])
      .map((img) => ({ url: img.url, data: questionImageCache.get(img.url) ?? null }))
      .filter((img) => img.data !== null);

    // Estimate block height
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const optionTexts = (q.options ?? []).map(
      (o, i) => `   ${OPTION_LABELS[i] ?? `(${i + 1})`} ${sanitize(o.name)}`
    );
    const optionLineGroups = optionTexts.map((t) => wrapLines(doc, t, WRAP_W - 6));
    const totalOptLines = optionLineGroups.reduce((s, g) => s + g.length, 0);
    const imgBlockH = qImages.length > 0 ? 42 : 0;
    const blockH = qLines.length * 5.5 + totalOptLines * 5 + imgBlockH + 4;

    ensureSpace(Math.min(blockH, PAGE_H - MB - contentTop));

    // Question text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    for (const line of qLines) {
      doc.text(line, ML, curY);
      curY += 5.5;
    }

    // Question images — only constrain height, preserve aspect ratio
    if (qImages.length > 0) {
      const IMG_MAX_H = 40;
      for (let ii = 0; ii < qImages.length; ii++) {
        const imgData = qImages[ii].data!;
        const fmt = getImageFormat(imgData);
        const props = doc.getImageProperties(imgData);
        const aspectRatio = props.width / props.height;
        const drawH = Math.min(IMG_MAX_H, PAGE_H - MB - curY - 4);
        const drawW = Math.min(drawH * aspectRatio, WRAP_W);
        const finalH = drawW / aspectRatio;

        ensureSpace(finalH + 3);
        doc.addImage(imgData, fmt, ML + 4, curY, drawW, finalH);
        curY += finalH + 3;
      }
    }

    // Options
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    for (const group of optionLineGroups) {
      for (const line of group) {
        ensureSpace(5);
        doc.text(line, ML + 4, curY);
        curY += 5;
      }
    }

    curY += 4;
  }

  // ── Draw footers on all pages ───────────────────────────────────────────────
  const totalPages = pageNum;
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageFooter(doc, p, totalPages);
  }

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}
