import { NextRequest, NextResponse } from 'next/server';
import { TeacherResponse, Teacher } from '@/types/teacher';

// Mock data for teachers - in a real app, this would come from a database
const teachersData: Teacher[] = [
    {
        id: "t1",
        name: "Dr. Sarah Wilson",
        email: "sarah.w@institute.edu",
        contact: "+1234567890",
        subjects: ["Physics", "Chemistry", "Mathematics"],
        batches: ["11-omega-1", "11-sigma-1", "12-omega-1"],
        totalStudents: 360,
        experience: 8,
        qualification: "Ph.D. in Physics",
        status: "active"
    },
    {
        id: "t2",
        name: "Prof. John Smith",
        email: "john.s@institute.edu",
        contact: "+1234567891",
        subjects: ["Biology", "Chemistry"],
        batches: ["11-omega-2", "12-omega-2"],
        totalStudents: 240,
        experience: 6,
        qualification: "M.Sc. in Biology",
        status: "active"
    },
    {
        id: "t3",
        name: "Dr. Emily Brown",
        email: "emily.b@institute.edu",
        contact: "+1234567892",
        subjects: ["Mathematics", "Physics"],
        batches: ["11-sigma-1", "12-sigma-1"],
        totalStudents: 240,
        experience: 10,
        qualification: "Ph.D. in Mathematics",
        status: "active"
    },
    {
        id: "t4",
        name: "Prof. Michael Davis",
        email: "michael.d@institute.edu",
        contact: "+1234567893",
        subjects: ["Chemistry", "Biology"],
        batches: ["11-omega-1", "12-omega-1"],
        totalStudents: 240,
        experience: 5,
        qualification: "M.Sc. in Chemistry",
        status: "active"
    }
];

// Mock data for batches - in a real app, this would come from a database
const batchesData = {
    "11-omega-1": {
        id: "11-omega-1",
        name: "Omega",
        standard: "11th Class",
        totalStudents: 120,
        subjects: ["Physics", "Chemistry"]
    },
    "11-sigma-1": {
        id: "11-sigma-1",
        name: "Sigma",
        standard: "11th Class",
        totalStudents: 120,
        subjects: ["Mathematics", "Physics"]
    },
    "12-omega-1": {
        id: "12-omega-1",
        name: "Omega",
        standard: "12th Class",
        totalStudents: 120,
        subjects: ["Chemistry", "Physics"]
    },
    "11-omega-2": {
        id: "11-omega-2",
        name: "Omega",
        standard: "11th Class",
        totalStudents: 120,
        subjects: ["Biology", "Chemistry"]
    },
    "12-omega-2": {
        id: "12-omega-2",
        name: "Omega",
        standard: "12th Class",
        totalStudents: 120,
        subjects: ["Biology", "Chemistry"]
    },
    "12-sigma-1": {
        id: "12-sigma-1",
        name: "Sigma",
        standard: "12th Class",
        totalStudents: 120,
        subjects: ["Mathematics", "Physics"]
    }
};

export async function GET(
    request: NextRequest,
    { params }: { params: { teacherId: string } }
) {
    try {
        const teacherId = params.teacherId;

        // Validate teacherId
        if (!teacherId) {
            return NextResponse.json(
                { error: 'Teacher ID is required' },
                { status: 400 }
            );
        }

        // Find the teacher
        const teacher = teachersData.find(t => t.id === teacherId);
        if (!teacher) {
            return NextResponse.json(
                { error: 'Teacher not found' },
                { status: 404 }
            );
        }

        // Get batch details for the teacher's batches
        const batches = teacher.batches.map(batchId => batchesData[batchId as keyof typeof batchesData]);

        // Prepare response
        const response: TeacherResponse = {
            teacher,
            batches
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching teacher details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch teacher details' },
            { status: 500 }
        );
    }
} 