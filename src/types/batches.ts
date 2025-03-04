export interface Batch {
  id: string;
  name: string;
  standard: string;
  subjects: string[];
  totalStudents: number;
  maxStudents: number;
  teacher: string;
}

export interface Standard {
  name: string;
  batches: Batch[];
}

export interface BatchesData {
  standards: Standard[];
}

export type BatchFilters = {
  standard: string;
  subject: string;
  teacher: string;
};
