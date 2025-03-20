import { NextRequest, NextResponse } from 'next/server';
import { TeachersResponse, Teacher } from '@/types/teacher';

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

export async function GET(request: NextRequest) {
    try {
        // Get query parameters for filtering and pagination
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search');
        const subject = searchParams.get('subject');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Filter teachers based on search term and filters
        let filteredTeachers = [...teachersData];

        if (search) {
            const searchLower = search.toLowerCase();
            filteredTeachers = filteredTeachers.filter(teacher =>
                teacher.name.toLowerCase().includes(searchLower) ||
                teacher.email.toLowerCase().includes(searchLower) ||
                teacher.qualification.toLowerCase().includes(searchLower)
            );
        }

        if (subject) {
            filteredTeachers = filteredTeachers.filter(teacher =>
                teacher.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()))
            );
        }

        if (status) {
            filteredTeachers = filteredTeachers.filter(teacher =>
                teacher.status.toLowerCase() === status.toLowerCase()
            );
        }

        // Sort teachers by name
        filteredTeachers.sort((a, b) => a.name.localeCompare(b.name));

        // Paginate results
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);

        // Prepare response with pagination metadata
        const response: TeachersResponse = {
            teachers: paginatedTeachers,
            pagination: {
                total: filteredTeachers.length,
                page,
                limit,
                totalPages: Math.ceil(filteredTeachers.length / limit)
            }
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        );
    }
} 