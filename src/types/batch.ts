export interface Student {
    id: string;
    name: string;
    rollNumber: string;
    attendance: number;
    performance: number;
    email: string;
    contact: string;
}

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

export interface BatchStudentsResponse {
    batchInfo: Batch;
    students: Student[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
} 