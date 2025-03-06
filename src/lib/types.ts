export interface Student {
    id: string;
    name: string;
    class: string;
    level: number;
    batchId?: string;
  }
  
  export interface Batch {
    id: string;
    name: string;
    subject: string;
    totalStudents: number;
    teacher: string;
  }
  
  export interface Institute {
    name: string;
    address: string;
    contact: string;
    email: string;
    studentsTotal: number;
    averageAttendance: number;
    activeCourses: number;
    performanceIndex: number;
    teachersTotal: number;
    activeClasses: number;
    departments: number;
    satisfactionRate: number;
  }