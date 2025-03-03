export interface Batch {
  standard: string;
  className: string;
  status: "active" | "inactive";
  subjects: string[];
  totalStudents: number;
  maxCapacity: number;
  instructor: string;
}

export interface BatchGroup {
  standard: string;
  batch: Batch[];
}
