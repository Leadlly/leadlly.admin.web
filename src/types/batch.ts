export type Batch = {
  id: number;
  name: string;
  class: "11" | "12";
  subjects: string[];
  totalStudents: number;
  maxStudents: number;
  status: "active" | "inactive";
  teacher: string;
  icon: string;
  iconBg: string;
};
