export interface Teacher {
    id: string;
    name: string;
    email: string;
    contact: string;
    subjects: string[];
    batches: string[]; // Array of batch IDs
    totalStudents: number;
    experience: number; // Years of experience
    qualification: string;
    status: 'active' | 'inactive';
}

export interface TeachersResponse {
    teachers: Teacher[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface TeacherResponse {
    teacher: Teacher;
    batches: {
        id: string;
        name: string;
        standard: string;
        totalStudents: number;
        subjects: string[];
    }[];
} 