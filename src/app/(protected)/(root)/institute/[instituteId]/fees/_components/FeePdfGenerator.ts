"use client";

import { IFeeRecord } from "@/actions/fee_actions";

export interface PdfMeta {
  instituteName: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  cin?: string;
}

function toWords(n: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  if (n === 0) return "Zero";

  function chunk(num: number): string {
    if (num === 0) return "";
    if (num < 20) return ones[num] + " ";
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "") + " ";
    return ones[Math.floor(num / 100)] + " Hundred " + chunk(num % 100);
  }

  let result = "";
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;

  if (crore) result += chunk(crore) + "Crore ";
  if (lakh) result += chunk(lakh) + "Lakh ";
  if (thousand) result += chunk(thousand) + "Thousand ";
  if (rest) result += chunk(rest);
  return result.trim();
}

export async function generateFeePdf(
  record: IFeeRecord,
  meta: PdfMeta
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;
  const margin = 15;
  let y = margin;

  // ─── Outer border ───────────────────────────────────────────────────────────
  doc.setDrawColor(0);
  doc.setLineWidth(0.6);
  doc.rect(margin, margin, W - 2 * margin, 275);

  // ─── Header area ────────────────────────────────────────────────────────────
  // Right block: institute info
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(meta.instituteName, W - margin - 2, y + 6, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  if (meta.address) doc.text(meta.address, W - margin - 2, y + 12, { align: "right" });
  if (meta.phone) doc.text(`Ph.: ${meta.phone}`, W - margin - 2, y + 17, { align: "right" });
  const webEmail = [meta.website, meta.email].filter(Boolean).join(", E-mail: ");
  if (webEmail) doc.text(`Website: ${webEmail}`, W - margin - 2, y + 22, { align: "right" });

  y += 28;

  // Divider
  doc.setLineWidth(0.3);
  doc.line(margin, y, W - margin, y);
  y += 5;

  // ─── Title ──────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(
    `Fee Acknowledgement - Academic Session:${record.academicSession ?? ""}`,
    W / 2,
    y + 5,
    { align: "center" }
  );
  y += 12;

  // ─── Form/Ack row ────────────────────────────────────────────────────────────
  doc.setLineWidth(0.3);
  doc.rect(margin, y, W - 2 * margin, 10);
  // Split in half
  const midX = margin + (W - 2 * margin) / 2;
  doc.line(midX, y, midX, y + 10);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Form No.:${record.formNo}`, margin + 3, y + 6.5);

  // Right half: Acknowledgement No + barcode-ish lines
  doc.setFont("helvetica", "normal");
  doc.text(`Acknowledgement No: ${record.acknowledgementNo}`, midX + 3, y + 4);
  // Simulate barcode using thin vertical rects
  let bx = midX + 3;
  const bY = y + 5.5;
  const heights = [3.5, 2, 3.5, 2.5, 3.5, 2, 3, 2.5, 3.5, 2, 3.5, 2, 3, 2.5, 3.5];
  const widths = [0.7, 0.3, 0.7, 0.3, 0.7, 0.3, 0.5, 0.3, 0.7, 0.3, 0.7, 0.3, 0.5, 0.3, 0.7];
  bx = midX + 55;
  doc.setFillColor(0, 0, 0);
  for (let i = 0; i < heights.length; i++) {
    doc.rect(bx, bY, widths[i], heights[i], "F");
    bx += widths[i] + 0.4;
  }
  y += 10;

  // ─── Info rows ───────────────────────────────────────────────────────────────
  const rowH = 8;
  const col1w = (W - 2 * margin) / 2;

  const rows: [string, string, string, string][] = [
    ["Name:", record.studentName, "Acknowledgement Dated:", record.paymentDate ? new Date(record.paymentDate).toLocaleDateString("en-IN") : ""],
    ["Father's Name:", record.fatherName ?? "", "Mother's Name:", record.motherName ?? ""],
    ["Stream Name:", record.streamName ?? "", "Course Name:", record.courseName ?? ""],
    ["Course Code:", record.courseCode ?? "", "Payment Mode:", record.paymentMode ?? ""],
    ["Center:", record.center ?? "", "", ""],
  ];

  for (const [l1, v1, l2, v2] of rows) {
    doc.setLineWidth(0.2);
    doc.rect(margin, y, col1w, rowH);
    doc.rect(margin + col1w, y, col1w, rowH);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(l1, margin + 2, y + 5.5);
    doc.setFont("helvetica", "bold");
    doc.text(v1, margin + 30, y + 5.5);

    if (l2) {
      doc.setFont("helvetica", "normal");
      doc.text(l2, margin + col1w + 2, y + 5.5);
      doc.setFont("helvetica", "bold");
      doc.text(v2, margin + col1w + 40, y + 5.5);
    }
    y += rowH;
  }

  // ─── Amounts row ─────────────────────────────────────────────────────────────
  const amtLeft = col1w;
  const amtRight = W - 2 * margin - amtLeft;
  const amtRows = [
    ["Tuition Fees", String(record.tuitionFees.toLocaleString("en-IN"))],
    [`IGST @ ${record.igstPercent} %`, String(record.igstAmount.toLocaleString("en-IN"))],
    ["Total Amount", String(record.totalAmount.toLocaleString("en-IN"))],
  ];
  const amtH = amtRows.length * 7 + 2;

  doc.setLineWidth(0.2);
  doc.rect(margin, y, amtLeft, amtH);
  doc.rect(margin + amtLeft, y, amtRight, amtH);

  // Left: amount in words
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  const words =
    record.amountInWords ||
    `RUPEES ${toWords(record.totalAmount)} Only`;
  doc.text("Total Amount in Words: RUPEES", margin + 2, y + 6);
  doc.setFont("helvetica", "normal");
  const wordLines = doc.splitTextToSize(words.replace(/^RUPEES\s*/i, ""), amtLeft - 4);
  doc.text(wordLines, margin + 2, y + 11);

  // Right: amounts table
  let ay = y + 1;
  const col3 = margin + amtLeft;
  const lw3 = amtRight * 0.65;
  const rw3 = amtRight - lw3;
  for (const [label, val] of amtRows) {
    doc.setLineWidth(0.15);
    doc.rect(col3, ay, lw3, 7);
    doc.rect(col3 + lw3, ay, rw3, 7);
    doc.setFont("helvetica", label === "Total Amount" ? "bold" : "normal");
    doc.setFontSize(8.5);
    doc.text(label, col3 + 2, ay + 5);
    doc.text(val, col3 + lw3 + rw3 - 2, ay + 5, { align: "right" });
    ay += 7;
  }
  y += amtH;

  // ─── GST note + footer notes ─────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const notes = [
    `GSTIN:${meta.cin ?? ""}`,
    "This is not a GST Tax Invoice.",
    "GST Invoice Cum Receipt will be uploaded on student portal within 30 days.",
    "This is computer generated acknowledgement, hence no signature required.",
    "All disputes are subject to local jurisdiction only.",
    "Duplicate \"Fee Receipt\" will be issued from office on cash payment of Rs. 100/- (Inclusive of taxes)",
    "Kindly keep this acknowledgement safe.",
  ];
  y += 4;
  for (const note of notes) {
    doc.text(note, margin + 3, y);
    y += 5;
  }

  y += 3;
  // Bottom divider
  doc.setLineWidth(0.3);
  doc.line(margin, y, W - margin, y);
  y += 5;

  // Footer
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  const footerText = `Registered & Corporate Office: ${meta.address ?? ""}`;
  doc.text(footerText, W / 2, y, { align: "center" });
  if (meta.cin) {
    doc.setFont("helvetica", "normal");
    doc.text(`CIN: - ${meta.cin}`, W / 2, y + 5, { align: "center" });
  }

  // Timestamp bottom-right
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    new Date().toLocaleString("en-IN"),
    W - margin - 2,
    margin + 275 + 5,
    { align: "right" }
  );

  doc.save(`fee-acknowledgement-${record.formNo}.pdf`);
}
