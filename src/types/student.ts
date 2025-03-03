export type StudentPerformanceLevel = "excellent" | "optimal" | "inefficient";

export type Student = {
  id: number;
  name: string;
  avatar: string;
  class: "11" | "12";
  performanceLevel: StudentPerformanceLevel;
  emoji: string;
};
