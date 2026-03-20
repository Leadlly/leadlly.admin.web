"use client";

import { IFeeRecord } from "@/actions/fee_actions";

export interface PdfMeta {
  instituteName: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  cin?: string;
  docLogoUrl?: string;
}

function toWords(n: number): string {
  if (n <= 0) return "Zero";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function chunk(num: number): string {
    if (num === 0) return "";
    if (num < 20) return ones[num] + " ";
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "") + " ";
    return ones[Math.floor(num / 100)] + " Hundred " + chunk(num % 100);
  }
  let r = "";
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;
  if (crore) r += chunk(crore) + "Crore ";
  if (lakh) r += chunk(lakh) + "Lakh ";
  if (thousand) r += chunk(thousand) + "Thousand ";
  if (rest) r += chunk(rest);
  return r.trim();
}

type JsPDFType = InstanceType<typeof import("jspdf").default>;

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

  try {
    // Primary attempt: direct image URL (works when CORS allows)
    return await toDataUrl(url);
  } catch {
    try {
      // Fallback: same-origin proxy for production CORS-restricted buckets
      const proxied = `/api/image-proxy?url=${encodeURIComponent(url)}`;
      return await toDataUrl(proxied);
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

function getParticulars(record: IFeeRecord) {
  const items: { label: string; amount: number; deduction: boolean }[] = [
    { label: "Tuition Fees", amount: record.tuitionFees ?? 0, deduction: false },
    ...(record.additionalFees ?? []).slice(0, 4).map((f) => ({
      label: f.label,
      amount: f.amount,
      deduction: f.type === "deduction",
    })),
    ...(record.discount && record.discount > 0
      ? [{ label: "Concession", amount: record.discount, deduction: true }]
      : []),
  ];
  return items;
}

function calcReceiptHeight(record: IFeeRecord): number {
  const feeRows = getParticulars(record).length + 1;
  const feeSectionH = feeRows * 7 + 2;
  // header(22) + divider(5) + title(7) + formRow(10) + infoRows(3*7=21) + feeSection + bottom(21)
  return 22 + 5 + 7 + 10 + 21 + feeSectionH + 21;
}

// ─── Draw one receipt copy ────────────────────────────────────────────────────

function drawReceipt(
  doc: JsPDFType,
  record: IFeeRecord,
  meta: PdfMeta,
  startY: number,
  logoData: string | null,
) {
  const W = 210;
  const M = 14;
  const IW = W - 2 * M;
  const totalH = calcReceiptHeight(record);
  let y = startY;
  const totalAmount = record.totalAmount ?? 0;
  const amountReceived = record.amountReceived ?? 0;
  const balance = record.balanceAmount ?? Math.max(totalAmount - amountReceived, 0);

  // ── Outer border ──────────────────────────────────────────────────────────
  doc.setDrawColor(0);
  doc.setLineWidth(0.6);
  doc.rect(M, y, IW, totalH);

  // ── Header: Logo left | Institute info right ──────────────────────────────
  if (logoData) {
    try {
      const logoMaxW = IW / 2 - 4;
      const logoMaxH = 18;
      doc.addImage(logoData, getImageFormat(logoData), M + 2, y + 2, logoMaxW, logoMaxH);
    } catch { /* skip */ }
  }

  const rx = W - M - 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0);
  doc.text(meta.instituteName || "Institution", rx, y + 7, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  if (meta.address) doc.text(meta.address, rx, y + 12, { align: "right" });
  if (meta.phone) doc.text(`Ph.: ${meta.phone}`, rx, y + 16, { align: "right" });
  const webEmail = [
    meta.website ? `Website: ${meta.website}` : null,
    meta.email ? `E-mail: ${meta.email}` : null,
  ].filter(Boolean).join(", ");
  if (webEmail) doc.text(webEmail, rx, y + 20, { align: "right" });

  y += 22;
  doc.setLineWidth(0.4);
  doc.line(M, y, M + IW, y);

  // ── Title ─────────────────────────────────────────────────────────────────
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(
    `Fee Acknowledgement - Academic Session:${record.academicSession ?? ""}`,
    W / 2, y, { align: "center" },
  );

  // ── Form No | Ack No ─────────────────────────────────────────────────────
  y += 7;
  const midX = M + IW / 2;

  doc.setLineWidth(0.3);
  doc.rect(M, y, IW, 10);
  doc.line(midX, y, midX, y + 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`Form No.:${record.formNo}`, M + 3, y + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(`UID: ${record.uniqueIdentificationNo ?? ""}`, M + 3, y + 8.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Acknowledgement No: ${record.acknowledgementNo}`, midX + 3, y + 4);

  // Barcode
  let bx = midX + IW / 2 - 22;
  const bY = y + 1;
  const bws = [0.7, 0.3, 0.7, 0.3, 0.7, 0.3, 0.5, 0.3, 0.7, 0.3, 0.7, 0.3, 0.5, 0.3, 0.7];
  const bhs = [4, 2.5, 4, 3, 4, 2.5, 3.5, 2.5, 4, 2.5, 4, 2.5, 3.5, 3, 4];
  doc.setFillColor(0, 0, 0);
  for (let i = 0; i < bws.length; i++) {
    doc.rect(bx, bY, bws[i], bhs[i], "F");
    bx += bws[i] + 0.4;
  }

  // ── Student info rows ─────────────────────────────────────────────────────
  y += 10;
  const rh = 7;
  const halfW = IW / 2;

  const rows: [string, string, string, string][] = [
    ["Name:", record.studentName, "Acknowledgement Dated:", record.paymentDate ? new Date(record.paymentDate).toLocaleDateString("en-IN") : ""],
    ["Father's Name:", record.fatherName ?? "", "Stream Name:", record.streamName ?? ""],
    ["Course Name:", `${record.courseName ?? ""}${record.courseCode ? ` (${record.courseCode})` : ""}`, "Payment Mode:", record.paymentMode ?? ""],
  ];

  for (const [l1, v1, l2, v2] of rows) {
    doc.setLineWidth(0.2);
    doc.rect(M, y, halfW, rh);
    doc.rect(M + halfW, y, halfW, rh);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text(l1, M + 2, y + 5);
    doc.setFont("helvetica", "bold");
    doc.text(v1, M + 28, y + 5);

    if (l2) {
      doc.setFont("helvetica", "normal");
      doc.text(l2, midX + 2, y + 5);
      doc.setFont("helvetica", "bold");
      doc.text(v2, midX + 35, y + 5);
    }
    y += rh;
  }

  // ── Fee: Amount in words (left) | Fee table (right) ───────────────────────
  const particulars = getParticulars(record);
  const feeRowH = 7;
  const feeSectionH = (particulars.length + 1) * feeRowH + 2;

  doc.setLineWidth(0.2);
  doc.rect(M, y, halfW, feeSectionH);

  const words = record.amountInWords || `${toWords(record.totalAmount ?? 0)} Only`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Total Amount in Words: RUPEES", M + 2, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const wl = doc.splitTextToSize(words.replace(/^RUPEES\s*/i, ""), halfW - 6);
  doc.text(wl, M + 2, y + 10);

  const rx2 = M + halfW;
  const labelColW = halfW * 0.62;
  const amtColW = halfW - labelColW;
  let fy = y;

  for (const p of particulars) {
    doc.setLineWidth(0.15);
    doc.rect(rx2, fy, labelColW, feeRowH);
    doc.rect(rx2 + labelColW, fy, amtColW, feeRowH);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(p.deduction ? 180 : 0, 0, 0);
    doc.text(p.label, rx2 + 2, fy + 5);
    const amtStr = p.deduction
      ? `-${p.amount.toLocaleString("en-IN")}`
      : p.amount.toLocaleString("en-IN");
    doc.text(amtStr, rx2 + labelColW + amtColW - 2, fy + 5, { align: "right" });
    doc.setTextColor(0);
    fy += feeRowH;
  }

  // Total row
  doc.setLineWidth(0.15);
  doc.rect(rx2, fy, labelColW, feeRowH);
  doc.rect(rx2 + labelColW, fy, amtColW, feeRowH);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Total Amount", rx2 + 2, fy + 5);
  doc.text(
    (record.totalAmount ?? 0).toLocaleString("en-IN"),
    rx2 + labelColW + amtColW - 2, fy + 5, { align: "right" },
  );

  y += feeSectionH;

  // ── Bottom: Payment + Signature ───────────────────────────────────────────
  doc.setLineWidth(0.3);
  doc.line(M, y, M + IW, y);
  y += 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(`Payment Mode   : ${record.paymentMode ?? ""}`, M + 2, y + 3);
  doc.text(`Net Fee        : Rs. ${totalAmount.toLocaleString("en-IN")}`, M + 2, y + 7);
  doc.text(`Amount Received: Rs. ${amountReceived.toLocaleString("en-IN")}`, M + 2, y + 11);
  doc.text(`Balance        : Rs. ${balance.toLocaleString("en-IN")}`, M + 2, y + 15);

  doc.text("Received By :", W - M - 50, y + 3);
  doc.setLineWidth(0.2);
  doc.line(W - M - 36, y + 9, W - M - 2, y + 9);
  doc.setFontSize(6.5);
  doc.text("(Authorised Signatory)", W - M - 19, y + 16.5, { align: "center" });

  y += 21;

}

// ─── Build PDF ───────────────────────────────────────────────────────────────

async function buildDoc(record: IFeeRecord, meta: PdfMeta): Promise<JsPDFType> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let logoData: string | null = null;
  if (meta.docLogoUrl) {
    logoData = await loadImageAsDataUrl(meta.docLogoUrl);
  }

  const PAGE_H = 297;
  const receiptH = calcReceiptHeight(record);
  const gap = 6;
  const topMargin = Math.max(4, (PAGE_H - 2 * receiptH - gap) / 2);

  drawReceipt(doc, record, meta, topMargin, logoData);

  // Cut line
  const cutY = topMargin + receiptH + gap / 2;
  doc.setDrawColor(130, 130, 130);
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(14, cutY, 196, cutY);
  doc.setLineDashPattern([], 0);

  drawReceipt(doc, record, meta, cutY + gap / 2, logoData);

  return doc;
}

export async function generateFeePdf(
  record: IFeeRecord,
  meta: PdfMeta,
): Promise<void> {
  const doc = await buildDoc(record, meta);
  const safeName = (record.studentName ?? "Student").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
  const uid = record.uniqueIdentificationNo ?? record.formNo;
  doc.save(`Fee_Receipt_${safeName}_${uid}.pdf`);
}

export async function printFeePdf(
  record: IFeeRecord,
  meta: PdfMeta,
): Promise<void> {
  const doc = await buildDoc(record, meta);
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => {
      win.focus();
      win.print();
      setTimeout(() => URL.revokeObjectURL(url), 8000);
    };
  } else {
    const safeName = (record.studentName ?? "Student").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
  const uid = record.uniqueIdentificationNo ?? record.formNo;
  doc.save(`Fee_Receipt_${safeName}_${uid}.pdf`);
  }
}
