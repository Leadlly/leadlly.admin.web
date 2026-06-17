export const BATCH_CHART_COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#a855f7",
  "#ef4444",
  "#06b6d4",
];

export const BATCH_BADGE_STYLES = [
  { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", accent: "#f59e0b" },
  { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", accent: "#3b82f6" },
  { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", accent: "#10b981" },
  { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", accent: "#a855f7" },
  { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", accent: "#ef4444" },
  { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", accent: "#06b6d4" },
] as const;

export type BatchBadgeStyle = (typeof BATCH_BADGE_STYLES)[number];

type BatchColorInput = {
  batchId?: string;
  batchName?: string;
};

export const buildBatchColorMap = (batches: BatchColorInput[] = []) => {
  const map = new Map<string, BatchBadgeStyle>();
  const sorted = [...batches].sort((a, b) =>
    String(a.batchName || a.batchId || "").localeCompare(
      String(b.batchName || b.batchId || ""),
      undefined,
      { sensitivity: "base" }
    )
  );

  sorted.forEach((batch, index) => {
    const style = BATCH_BADGE_STYLES[index % BATCH_BADGE_STYLES.length];
    if (batch.batchId) map.set(String(batch.batchId), style);
    if (batch.batchName) map.set(String(batch.batchName), style);
  });

  return map;
};

export const buildBatchColorMapFromPerformance = (
  batchPerformance: Array<{ batchId?: string; batchName?: string }> = []
) =>
  buildBatchColorMap(
    batchPerformance.map((batch) => ({
      batchId: batch.batchId ? String(batch.batchId) : undefined,
      batchName: batch.batchName,
    }))
  );

export const getBatchStyle = (
  batchColorMap: Map<string, BatchBadgeStyle>,
  item: {
    batch?: { _id?: string; name?: string };
    batchId?: string;
    batchName?: string;
  },
  fallbackIndex = 0
) => {
  const batchId = item.batch?._id || item.batchId;
  const batchName = item.batch?.name || item.batchName;

  return (
    (batchId && batchColorMap.get(String(batchId))) ||
    (batchName && batchColorMap.get(String(batchName))) ||
    BATCH_BADGE_STYLES[fallbackIndex % BATCH_BADGE_STYLES.length]
  );
};
