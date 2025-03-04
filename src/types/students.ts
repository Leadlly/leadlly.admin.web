export interface Student {
  name: string;
  class: number;
  level: number;
  status: "excellent" | "optimal" | "inefficient";
}

export const options = ["all", "excellent", "optimal", "inefficient"];