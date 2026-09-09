"use client";

import type { QBQuestion } from "@/actions/question_bank_actions";
import { formatClassLabel } from "@/helpers/constants/academic";

export interface QuestionPdfMeta {
  subject?: string;
  standard?: string;
  title?: string;
  chapterNames?: string[];
  filterLabel?: string;
  logoUrl?: string;
  instituteName?: string;
}

const OPTION_LABELS = ["1", "2", "3", "4"];
const ALLOWED_TAGS = new Set(["sup", "sub", "b", "i", "em", "strong", "br"]);
const SMALL_WORDS = new Set([
  "and",
  "or",
  "of",
  "the",
  "a",
  "an",
  "in",
  "on",
  "for",
  "to",
  "vs",
  "via",
]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Title Case: "MOLE CONCEPT" → "Mole Concept", "structure of atom" → "Structure of Atom" */
export function toTitleCase(input: string): string {
  const words = input.trim().split(/\s+/).filter(Boolean);
  return words
    .map((word, index) => {
      const parts = word.split("-").map((part) => {
        if (!part) return part;
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      });
      const joined = parts.join("-");
      const lower = joined.toLowerCase();
      if (index > 0 && SMALL_WORDS.has(lower)) return lower;
      return joined;
    })
    .join(" ");
}

function sanitizeHtml(raw: string): string {
  if (!raw) return "";
  let t = raw;
  while (t.includes("&amp;")) t = t.replace(/&amp;/g, "&");
  t = t.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  t = t
    .replace(/&nbsp;/g, " ")
    .replace(/&minus;/g, "−")
    .replace(/&times;/g, "×")
    .replace(/&divide;/g, "÷")
    .replace(/&plusmn;/g, "±")
    .replace(/&alpha;/g, "α")
    .replace(/&beta;/g, "β")
    .replace(/&gamma;/g, "γ")
    .replace(/&theta;/g, "θ")
    .replace(/&pi;/g, "π")
    .replace(/&omega;/g, "ω")
    .replace(/&mu;/g, "μ")
    .replace(/&sigma;/g, "σ")
    .replace(/&lambda;/g, "λ")
    .replace(/&Delta;/g, "Δ")
    .replace(/&radic;/g, "√")
    .replace(/&infin;/g, "∞")
    .replace(/&ge;/g, "≥")
    .replace(/&le;/g, "≤")
    .replace(/&ne;/g, "≠")
    .replace(/&deg;/g, "°")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&bull;/g, "•")
    .replace(/&hellip;/g, "…")
    .replace(/&([a-zA-Z]+);/g, " ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#([0-9]+);/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    );

  t = t.replace(
    /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g,
    (_, slash, tagName) => {
      const tag = tagName.toLowerCase();
      return ALLOWED_TAGS.has(tag) ? `<${slash}${tag}>` : "";
    }
  );

  return t;
}

function buildChapterHeader(meta: QuestionPdfMeta): string {
  const names = (meta.chapterNames ?? []).map((n) => n.trim()).filter(Boolean);
  const raw =
    names.length > 0
      ? names.join(", ")
      : meta.filterLabel || meta.subject || "Question Bank";
  return toTitleCase(raw);
}

const LETTER_TO_NUM: Record<string, string> = {
  A: "1",
  B: "2",
  C: "3",
  D: "4",
};

function isCorrectTag(tag?: string): boolean {
  return /^correct$/i.test((tag ?? "").trim());
}

function plainOptionText(name: string): string {
  return sanitizeHtml(name)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Map a stored answer token (1–4, A–D, or option text) to the printed option number. */
function tokenToOptionNumber(
  token: string,
  options: QBQuestion["options"]
): string | null {
  const t = token.trim().replace(/[().]/g, "");
  if (!t) return null;
  if (/^[1-4]$/.test(t)) return t;
  const letter = t.toUpperCase();
  if (LETTER_TO_NUM[letter]) return LETTER_TO_NUM[letter];

  const idx = options.findIndex((opt) => {
    const plain = plainOptionText(opt.name ?? "");
    return plain && (plain === t || plain.toLowerCase() === t.toLowerCase());
  });
  return idx >= 0 ? String(idx + 1) : null;
}

/**
 * Resolve correct option numbers as shown in the PDF (1–4).
 * Prefers options tagged "Correct" in DB; falls back to the `answer` field.
 */
export function getCorrectOptionNumbers(q: QBQuestion): string[] {
  const options = q.options ?? [];
  const fromTags = options
    .map((opt, i) => ({ opt, n: String(i + 1) }))
    .filter(({ opt }) => isCorrectTag(opt.tag))
    .map(({ n }) => n);
  if (fromTags.length > 0) return fromTags;

  const raw = Array.isArray(q.answer)
    ? q.answer.join(",")
    : q.answer == null
      ? ""
      : String(q.answer);
  if (!raw.trim()) return [];

  const tokens = raw
    .split(/[,;/+\s&|]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const numbers: string[] = [];
  const push = (n: string | null) => {
    if (n && !numbers.includes(n)) numbers.push(n);
  };

  for (const token of tokens) push(tokenToOptionNumber(token, options));

  if (numbers.length === 0) {
    const compact = raw.replace(/[^A-Da-d1-4]/g, "");
    for (const ch of compact) push(tokenToOptionNumber(ch, options));
  }

  return numbers;
}

function formatAnswerKeyEntry(index: number, q: QBQuestion): string | null {
  const nums = getCorrectOptionNumbers(q);
  if (nums.length === 0) return null;
  return `Q${index} ${nums.map((n) => `(${n})`).join(" ")}`;
}

const PAGE_MARGIN_MM = 12;
const INNER_W_MM = 210 - PAGE_MARGIN_MM * 2;
const INNER_H_MM = 297 - PAGE_MARGIN_MM * 2;

const QUESTION_BLOCK_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  p { margin: 0; padding: 0; }
  .question { margin: 0 0 16px 0; }
  .q-text { line-height: 1.45; text-align: left; font-family: "Times New Roman", Times, Georgia, serif; font-size: 10pt; color: #111; }
  .q-num { font-weight: 700; margin-right: 4px; }
  .q-images { margin: 4px 0 4px 14px; }
  .q-images img { max-height: 70px; max-width: 100%; object-fit: contain; margin-right: 6px; }
  .options { display: grid; grid-template-columns: 1fr 1fr; gap: 1px 10px; margin-top: 3px; padding-left: 14px; }
  .option { display: flex; align-items: baseline; gap: 4px; line-height: 1.4; }
  .option img { max-height: 44px; object-fit: contain; }
  .opt-label { font-weight: 700; min-width: 20px; }
  sup { font-size: 0.65em; vertical-align: super; }
  sub { font-size: 0.65em; vertical-align: sub; }
`;

function sheetLayoutCss(): string {
  return `
    .sheet-page {
      position: relative;
      z-index: 1;
      width: ${INNER_W_MM}mm;
      height: ${INNER_H_MM}mm;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex: 0 0 auto;
      margin-bottom: 8px;
    }
    .chapter-banner {
      display: inline-block;
      background: #e4e4e4;
      color: #111;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: 0.2px;
      padding: 4px 16px;
      line-height: 1.35;
      max-width: 72%;
    }
    .header-meta {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      color: #555;
      white-space: nowrap;
    }
    .cols {
      flex: 1 1 auto;
      display: flex;
      min-height: 0;
    }
    .col {
      flex: 1 1 0;
      width: 50%;
      padding-right: 8px;
    }
    .col + .col {
      padding-right: 0;
      padding-left: 8px;
      border-left: 0.4pt solid #d0d0d0;
    }
    .page-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex: 0 0 auto;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7.5pt;
      color: #666;
      border-top: 1px solid #c8c8c8;
      padding-top: 4px;
      margin-top: 6px;
    }
    .page-footer .brand {
      font-weight: 700;
      color: #4b2ad6;
      letter-spacing: 0.3px;
    }
  `;
}

function renderQuestionBlock(q: QBQuestion, qi: number): string {
  const images =
    q.images && q.images.length > 0
      ? `<div class="q-images">${q.images
          .map((img) => `<img src="${escapeHtml(img.url)}" alt="" />`)
          .join("")}</div>`
      : "";

  const options =
    q.options && q.options.length > 0
      ? `<div class="options">${q.options
          .map(
            (opt, oi) =>
              `<div class="option"><span class="opt-label">(${OPTION_LABELS[oi] ?? oi + 1})</span><span>${sanitizeHtml(opt.name)}</span>${
                opt.images
                  ? `<img src="${escapeHtml(opt.images)}" alt="" />`
                  : ""
              }</div>`
          )
          .join("")}</div>`
      : "";

  return `<div class="question">
    <p class="q-text"><span class="q-num">${qi + 1}.</span> ${sanitizeHtml(q.question)}</p>
    ${images}
    ${options}
  </div>`;
}

function waitForDocumentReady(doc: Document, timeoutMs = 2500): Promise<void> {
  return new Promise((resolve) => {
    const finish = () => resolve();
    const imgs = Array.from(doc.images);
    if (imgs.length === 0) {
      requestAnimationFrame(() => requestAnimationFrame(finish));
      return;
    }
    let pending = imgs.length;
    const tick = () => {
      pending -= 1;
      if (pending <= 0) finish();
    };
    imgs.forEach((img) => {
      if (img.complete) tick();
      else {
        img.addEventListener("load", tick);
        img.addEventListener("error", tick);
      }
    });
    setTimeout(finish, timeoutMs);
  });
}

async function measureQuestionHeights(
  blocks: string[]
): Promise<{ heights: number[]; maxColHeightPx: number }> {
  const fallback = {
    heights: blocks.map(() => 80),
    maxColHeightPx: 900,
  };
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;left:-14000px;top:0;width:820px;height:1400px;opacity:0;pointer-events:none;border:0;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return fallback;
  }

  doc.open();
  doc.write(`<!DOCTYPE html><html><head><style>
    html, body { margin: 0; padding: 0; background: #fff; }
    body {
      font-family: "Times New Roman", Times, Georgia, serif;
      font-size: 10pt;
      color: #111;
    }
    ${sheetLayoutCss()}
    ${QUESTION_BLOCK_CSS}
  </style></head><body>
    <section class="sheet-page" id="probe">
      <div class="page-header">
        <div class="chapter-banner">Chapter Name</div>
        <div class="header-meta">Subject · Class 11</div>
      </div>
      <div class="cols">
        <div class="col" id="probe-col"></div>
        <div class="col"></div>
      </div>
      <div class="page-footer">
        <span>Institute</span>
        <span class="brand">Leadlly</span>
        <span>Date</span>
      </div>
    </section>
    <div id="measure-col"></div>
  </body></html>`);
  doc.close();

  await waitForDocumentReady(doc);
  const probeCol = doc.getElementById("probe-col");
  const measureCol = doc.getElementById("measure-col");
  if (!probeCol || !measureCol) {
    iframe.remove();
    return fallback;
  }

  const maxColHeightPx = Math.max(1, probeCol.getBoundingClientRect().height);
  const colWidthPx = Math.max(1, probeCol.getBoundingClientRect().width);
  measureCol.style.width = `${colWidthPx}px`;
  measureCol.innerHTML = blocks
    .map((b, i) => `<div data-i="${i}">${b}</div>`)
    .join("");

  await waitForDocumentReady(doc);
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  const heights = Array.from(doc.querySelectorAll("[data-i]")).map((el) => {
    const q = (el as HTMLElement).querySelector(".question") as HTMLElement | null;
    const node = q ?? (el as HTMLElement);
    const rect = node.getBoundingClientRect();
    const style = doc.defaultView?.getComputedStyle(node);
    const mb = style ? parseFloat(style.marginBottom) || 0 : 0;
    return rect.height + mb;
  });
  iframe.remove();

  return {
    heights: heights.length === blocks.length ? heights : fallback.heights,
    maxColHeightPx,
  };
}

type PagePack = { left: number[]; right: number[] };

function packQuestionsPageWise(heights: number[], maxColHeightPx: number): PagePack[] {
  const pages: PagePack[] = [];
  let left: number[] = [];
  let right: number[] = [];
  let leftH = 0;
  let rightH = 0;
  let side: "left" | "right" = "left";

  const flush = () => {
    if (left.length || right.length) pages.push({ left, right });
    left = [];
    right = [];
    leftH = 0;
    rightH = 0;
    side = "left";
  };

  for (let i = 0; i < heights.length; i++) {
    const h = Math.max(heights[i], 1);
    if (side === "left") {
      if (left.length === 0 || leftH + h <= maxColHeightPx) {
        left.push(i);
        leftH += h;
      } else {
        side = "right";
        if (right.length === 0 || rightH + h <= maxColHeightPx) {
          right.push(i);
          rightH += h;
        } else {
          flush();
          left.push(i);
          leftH += h;
        }
      }
    } else if (rightH + h <= maxColHeightPx) {
      right.push(i);
      rightH += h;
    } else {
      flush();
      left.push(i);
      leftH += h;
    }
  }
  flush();
  return pages;
}

export async function generateQuestionBankPdf(
  questions: QBQuestion[],
  meta: QuestionPdfMeta
): Promise<void> {
  const title = meta.subject
    ? `${toTitleCase(meta.subject)} - Question Bank`
    : (meta.title || "Question Bank").replace(/\s*[—–−‐‑‒―]\s*/g, " - ");
  const chapterHeader = buildChapterHeader(meta);
  const metaLine = [
    meta.subject ? toTitleCase(meta.subject) : "",
    meta.standard ? formatClassLabel(meta.standard) : "",
  ]
    .filter(Boolean)
    .join("  ·  ");
  const institute = meta.instituteName?.trim() || "Leadlly";
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const watermarkSrc =
    meta.logoUrl || `${window.location.origin}/leadlly_logo.svg`;

  const blocks = questions.map((q, i) => renderQuestionBlock(q, i));
  const { heights, maxColHeightPx } = await measureQuestionHeights(blocks);
  const pages = packQuestionsPageWise(heights, maxColHeightPx);

  const answerKeyItems = questions
    .map((q, qi) => formatAnswerKeyEntry(qi + 1, q))
    .filter((entry): entry is string => Boolean(entry));

  const headerHtml = `<div class="page-header">
    <div class="chapter-banner">${escapeHtml(chapterHeader)}</div>
    ${metaLine ? `<div class="header-meta">${escapeHtml(metaLine)}</div>` : ""}
  </div>`;

  const footerHtml = `<div class="page-footer">
    <span>${escapeHtml(institute)}</span>
    <span class="brand">Leadlly</span>
    <span>${escapeHtml(dateStr)}</span>
  </div>`;

  const questionPagesHtml = pages
    .map((page) => {
      const leftHtml = page.left.map((i) => blocks[i]).join("");
      const rightHtml = page.right.map((i) => blocks[i]).join("");
      return `<section class="sheet-page">
        ${headerHtml}
        <div class="cols">
          <div class="col">${leftHtml}</div>
          <div class="col">${rightHtml}</div>
        </div>
        ${footerHtml}
      </section>`;
    })
    .join("");

  const answerKeyPageHtml =
    answerKeyItems.length > 0
      ? `<section class="sheet-page answer-page">
        ${headerHtml}
        <div class="answer-wrap">
          <h2>Answer Key</h2>
          <div class="answer-grid">
            ${answerKeyItems
              .map((entry) => `<div class="answer-item">${escapeHtml(entry)}</div>`)
              .join("")}
          </div>
        </div>
        ${footerHtml}
      </section>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #fff; }
    body {
      font-family: "Times New Roman", Times, Georgia, serif;
      font-size: 10pt;
      color: #111;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .watermark {
      position: fixed;
      top: 42%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-28deg);
      opacity: 0.06;
      pointer-events: none;
      z-index: 0;
      width: 55%;
      text-align: center;
    }
    .watermark img {
      width: 100%;
      max-width: 280px;
      height: auto;
    }

    ${sheetLayoutCss()}
    .sheet-page {
      page-break-after: always;
      break-after: page;
    }
    .sheet-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }

    ${QUESTION_BLOCK_CSS}

    .answer-wrap { flex: 1 1 auto; }
    .answer-wrap h2 {
      font-size: 16pt;
      font-weight: 700;
      margin: 0 0 12px 0;
    }
    .answer-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      column-gap: 18px;
      row-gap: 5px;
    }
    .answer-item {
      font-size: 11pt;
      line-height: 1.65;
      white-space: nowrap;
    }

    @page { size: A4; margin: ${PAGE_MARGIN_MM}mm; }
  </style>
</head>
<body>
  <div class="watermark">
    <img src="${escapeHtml(watermarkSrc)}" alt="" />
  </div>
  ${questionPagesHtml}
  ${answerKeyPageHtml}
  <script>
    window.addEventListener("load", () => {
      setTimeout(() => window.print(), 400);
    });
  </script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Popup blocked — please allow popups for this site and try again.");
    return;
  }
  win.document.write(html);
  win.document.close();
}
