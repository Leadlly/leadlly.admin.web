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

function sanitize(text: string): string {
  return (text ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
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
  meta: { subject?: string; standard?: string; title?: string }
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const title = meta.title || "Question Bank";
  const subtitle = [
    meta.subject && `Subject: ${meta.subject}`,
    meta.standard && `Class: ${meta.standard}`,
  ]
    .filter(Boolean)
    .join("  |  ");

  // We'll do a two-pass approach: first pass to compute total pages, second to draw.
  // Instead, we'll track pages dynamically.
  let curY = MT;
  let pageNum = 1;
  const footerLines: { pageNum: number }[] = [];

  const newPage = () => {
    footerLines.push({ pageNum });
    doc.addPage();
    pageNum++;
    curY = MT;
  };

  const ensureSpace = (needed: number) => {
    if (curY + needed > PAGE_H - MB) {
      newPage();
    }
  };

  // ── Title page header ───────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  const titleLines = wrapLines(doc, title, IW);
  for (const line of titleLines) {
    doc.text(line, PAGE_W / 2, curY, { align: "center" });
    curY += 7;
  }

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(subtitle, PAGE_W / 2, curY, { align: "center" });
    curY += 5;
  }

  doc.setDrawColor(200);
  doc.setLineWidth(0.4);
  doc.line(ML, curY, ML + IW, curY);
  curY += 6;
  doc.setTextColor(0);

  // ── Questions ───────────────────────────────────────────────────────────────
  for (let qi = 0; qi < questions.length; qi++) {
    const q = questions[qi];
    const qNum = qi + 1;
    const qText = sanitize(q.question);
    const qLines = wrapLines(doc, `${qNum}. ${qText}`, IW);

    // Estimate block height: question + options
    const optionTexts = (q.options ?? []).map(
      (o, i) => `   ${OPTION_LABELS[i] ?? `(${i + 1})`} ${sanitize(o.name)}`
    );
    const optionLineGroups = optionTexts.map((t) => wrapLines(doc, t, IW - 6));
    const totalOptLines = optionLineGroups.reduce((s, g) => s + g.length, 0);
    const blockH = qLines.length * 5.5 + totalOptLines * 5 + 4;

    ensureSpace(blockH);

    // Question text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    for (const line of qLines) {
      doc.text(line, ML, curY);
      curY += 5.5;
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
  footerLines.push({ pageNum }); // last page
  const totalPages = pageNum;

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageFooter(doc, p, totalPages);
  }

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}
