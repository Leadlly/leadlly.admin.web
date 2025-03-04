import { NextRequest, NextResponse } from 'next/server';

// Mock data for students in batches - in a real app, this would come from a database
const getStudentsData = (batchId: string) => {
  // Validate batchId format
  if (!batchId.match(/^\d{2}-(omega|sigma)-\d+$/i)) {
    throw new Error('Invalid batch ID format');
  }

  return {
    batchInfo: {
      id: batchId,
      name: batchId.includes('omega') ? 'Omega' : 'Sigma',
      standard: batchId.startsWith('11') ? '11th Class' : '12th Class',
      subjects: batchId.includes('omega') ? ['Physics', 'Chemistry'] : ['Mathematics'],
      teacher: "Dr. Sarah Wilson"
    },
    students: [
      {
        id: "s1",
        name: "Alex Johnson",
        rollNumber: "R2023001",
        attendance: 92,
        performance: 8.7,
        email: "alex.j@student.edu",
        contact: "+1234567890"
      },
      {
        id: "s2",
        name: "Emma Williams",
        rollNumber: "R2023002",
        attendance: 98,
        performance: 9.5,
        email: "emma.w@student.edu",
        contact: "+1234567891"
      },
      {
        id: "s3",
        name: "Michael Brown",
        rollNumber: "R2023003",
        attendance: 85,
        performance: 7.8,
        email: "michael.b@student.edu",
        contact: "+1234567892"
      },
      {
        id: "s4",
        name: "Sophia Davis",
        rollNumber: "R2023004",
        attendance: 94,
        performance: 8.9,
        email: "sophia.d@student.edu",
        contact: "+1234567893"
      },
      {
        id: "s5",
        name: "James Miller",
        rollNumber: "R2023005",
        attendance: 90,
        performance: 8.2,
        email: "james.m@student.edu",
        contact: "+1234567894"
      },
      {
        id: "s6",
        name: "Olivia Wilson",
        rollNumber: "R2023006",
        attendance: 96,
        performance: 9.1,
        email: "olivia.w@student.edu",
        contact: "+1234567895"
      },
      {
        id: "s7",
        name: "William Taylor",
        rollNumber: "R2023007",
        attendance: 88,
        performance: 7.9,
        email: "william.t@student.edu",
        contact: "+1234567896"
      },
      {
        id: "s8",
        name: "Ava Anderson",
        rollNumber: "R2023008",
        attendance: 93,
        performance: 8.6,
        email: "ava.a@student.edu",
        contact: "+1234567897"
      }
    ]
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const batchId = params.batchId;

    // Validate batchId
    if (!batchId) {
      return NextResponse.json(
        { error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    // Get query parameters for filtering and pagination
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'name';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    try {
      // Get students data
      const { batchInfo, students } = getStudentsData(batchId);

      // Filter students based on search term
      let filteredStudents = [...students];
      if (search) {
        const searchLower = search.toLowerCase();
        filteredStudents = filteredStudents.filter(student => 
          student.name.toLowerCase().includes(searchLower) ||
          student.rollNumber.toLowerCase().includes(searchLower) ||
          student.email.toLowerCase().includes(searchLower)
        );
      }

      // Sort students
      filteredStudents.sort((a, b) => {
        switch (sortBy) {
          case 'rollNumber':
            return a.rollNumber.localeCompare(b.rollNumber);
          case 'attendance':
            return b.attendance - a.attendance;
          case 'performance':
            return b.performance - a.performance;
          case 'name':
          default:
            return a.name.localeCompare(b.name);
        }
      });

      // Paginate results
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

      // Prepare response with pagination metadata
      const response = {
        batchInfo,
        students: paginatedStudents,
        pagination: {
          total: filteredStudents.length,
          page,
          limit,
          totalPages: Math.ceil(filteredStudents.length / limit)
        }
      };

      return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
      if (error.message === 'Invalid batch ID format') {
        return NextResponse.json(
          { error: 'Invalid batch ID format' },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}