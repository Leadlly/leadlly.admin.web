import { NextRequest, NextResponse } from 'next/server';
import { BatchesData } from '@/types/batch';

// Mock data for batches - in a real app, this would come from a database
const batchesData: BatchesData = {
  standards: [
    {
      name: "11th standard",
      batches: [
        {
          id: "11-omega-1",
          name: "Omega",
          standard: "11th Class",
          subjects: ["Chemistry", "Physics", "Biology"],
          totalStudents: 120,
          maxStudents: 180,
          teacher: "Dr. Sarah Wilson"
        },
        {
          id: "11-sigma-1",
          name: "Sigma",
          standard: "11th Class",
          subjects: ["Mathematics", "Chemistry", "Physics"],
          totalStudents: 120,
          maxStudents: 180,
          teacher: "Dr. Sarah Wilson"
        },
        {
          id: "11-omega-2",
          name: "Omega",
          standard: "11th Class",
          subjects: ["Physics"],
          totalStudents: 120,
          maxStudents: 180,
          teacher: "Dr. Sarah Wilson"
        }
      ]
    },
    {
      name: "12th standard",
      batches: [
        {
          id: "12-omega-1",
          name: "Omega",
          standard: "12th Class",
          subjects: ["Chemistry"],
          totalStudents: 120,
          maxStudents: 180,
          teacher: "Dr. Sarah Wilson"
        },
        {
          id: "12-sigma-1",
          name: "Sigma",
          standard: "12th Class",
          subjects: ["Mathematics"],
          totalStudents: 120,
          maxStudents: 180,
          teacher: "Dr. Sarah Wilson"
        },
        {
          id: "12-omega-2",
          name: "Omega",
          standard: "12th Class",
          subjects: ["Physics"],
          totalStudents: 120,
          maxStudents: 180,
          teacher: "Dr. Sarah Wilson"
        }
      ]
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const standard = searchParams.get('standard');
    const subject = searchParams.get('subject');
    const teacher = searchParams.get('teacher');

    // Filter the data based on query parameters
    let filteredData: BatchesData = { ...batchesData };

    if (standard) {
      filteredData.standards = filteredData.standards.filter(
        std => std.name.toLowerCase().includes(standard.toLowerCase())
      );
    }

    // Filter batches within each standard
    filteredData.standards = filteredData.standards.map(std => {
      let filteredBatches = [...std.batches];

      if (subject) {
        filteredBatches = filteredBatches.filter(batch =>
          batch.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()))
        );
      }

      if (teacher) {
        filteredBatches = filteredBatches.filter(batch =>
          batch.teacher.toLowerCase().includes(teacher.toLowerCase())
        );
      }

      return {
        ...std,
        batches: filteredBatches
      };
    });

    // Remove standards with no batches after filtering
    filteredData.standards = filteredData.standards.filter(std => std.batches.length > 0);

    return NextResponse.json(filteredData, { status: 200 });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batches' },
      { status: 500 }
    );
  }
}