"use client";

import type { QBQuestion } from "@/actions/question_bank_actions";
import { formatClassLabel } from "@/helpers/constants/academic";

export interface QuestionPdfMeta {
  subject?: string;
  standard?: string;
  title?: string;
  filterLabel?: string;
  logoUrl?: string;
  instituteName?: string;
}

const OPTION_LABELS = ["A", "B", "C", "D"];
const ALLOWED_TAGS = new Set(["sup", "sub", "b", "i", "em", "strong", "br"]);

function sanitizeHtml(raw: string): string {
  if (!raw) return "";
  // Decode &amp; first (loop handles double-encoded &amp;amp;)
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

  // Strip attributes from tags; keep only allowed tags
  t = t.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g, (_, slash, tagName) => {
    const tag = tagName.toLowerCase();
    return ALLOWED_TAGS.has(tag) ? `<${slash}${tag}>` : "";
  });

  return t;
}

export async function generateQuestionBankPdf(
  questions: QBQuestion[],
  meta: QuestionPdfMeta
): Promise<void> {
  const title = meta.title || "Question Bank";
  const headerLine = meta.filterLabel || meta.subject || title;
  const subLine = [meta.subject, meta.standard ? formatClassLabel(meta.standard) : ""]
    .filter(Boolean)
    .join(" | ");

  const questionsHtml = questions
    .map((q, qi) => {
      const images =
        q.images && q.images.length > 0
          ? `<div class="q-images">${q.images
              .map((img) => `<img src="${img.url}" alt="" />`)
              .join("")}</div>`
          : "";

      const options =
        q.options && q.options.length > 0
          ? `<div class="options">${q.options
              .map(
                (opt, oi) =>
                  `<div class="option"><span class="opt-label">(${OPTION_LABELS[oi] ?? oi + 1})</span><span>${sanitizeHtml(opt.name)}</span>${
                    opt.images ? `<img src="${opt.images}" alt="" />` : ""
                  }</div>`
              )
              .join("")}</div>`
          : "";

      return `<div class="question">
        <p class="q-text"><span class="q-num">${qi + 1}.</span> ${sanitizeHtml(q.question)}</p>
        ${images}
        ${options}
      </div>`;
    })
    .join("");

  const logoHtml = meta.logoUrl
    ? `<img class="logo" src="${meta.logoUrl}" alt="logo" />`
    : meta.instituteName
    ? `<span class="inst-name">${meta.instituteName}</span>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      color: #000;
      background: #fff;
      padding: 20mm 18mm;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #333;
      padding-bottom: 6px;
      margin-bottom: 14px;
    }
    .logo { height: 36px; width: auto; }
    .inst-name { font-weight: bold; font-size: 11pt; }
    .header-center { text-align: center; flex: 1; }
    .header-title { font-size: 13pt; font-weight: bold; }
    .header-sub { font-size: 9pt; color: #444; margin-top: 2px; }
    .question {
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    .q-text {
      font-weight: bold;
      line-height: 1.6;
    }
    .q-num { color: #333; margin-right: 4px; }
    .q-images {
      margin: 6px 0 6px 16px;
    }
    .q-images img {
      max-height: 80px;
      max-width: 100%;
      object-fit: contain;
      margin-right: 8px;
    }
    .options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px 12px;
      margin-top: 5px;
      padding-left: 16px;
      font-weight: normal;
    }
    .option {
      display: flex;
      align-items: baseline;
      gap: 5px;
      line-height: 1.5;
    }
    .option img {
      max-height: 50px;
      object-fit: contain;
    }
    .opt-label { font-weight: bold; min-width: 22px; }
    sup { font-size: 0.65em; vertical-align: super; }
    sub { font-size: 0.65em; vertical-align: sub; }
    footer {
      position: fixed;
      bottom: 10mm;
      left: 18mm;
      right: 18mm;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #666;
      border-top: 1px solid #ccc;
      padding-top: 4px;
    }
    @media print {
      body { padding: 0; }
      @page { margin: 18mm; size: A4; }
    }
  </style>
</head>
<body>
  <header>
    <div>${logoHtml}</div>
    <div class="header-center">
      <div class="header-title">${headerLine}</div>
      ${subLine ? `<div class="header-sub">${subLine}</div>` : ""}
    </div>
    <div></div>
  </header>
  ${questionsHtml}
  <footer>
    <span>Leadlly</span>
    <span>${title}</span>
    <span>${new Date().toLocaleDateString("en-IN")}</span>
  </footer>
  <script>
    // Wait for images to load before printing
    window.addEventListener("load", () => {
      setTimeout(() => window.print(), 300);
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
