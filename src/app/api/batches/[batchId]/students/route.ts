import { NextRequest, NextResponse } from 'next/server';

// Mock data for students
const getStudentsData = (batchId: string) => {
  return {
    students: [
      { name: "Abhinav Mishra", class: 11, level: 80, status: "excellent" },
      { name: "Abhinav Mishra", class: 11, level: 50, status: "optimal" },
      { name: "Abhinav Mishra", class: 11, level: 20, status: "inefficient" },
      { name: "Abhinav Mishra", class: 11, level: 80, status: "excellent" },
      { name: "Abhinav Mishra", class: 11, level: 30, status: "inefficient" },
      { name: "Abhinav Mishra", class: 11, level: 50, status: "optimal" },
      { name: "Abhinav Mishra", class: 11, level: 40, status: "optimal" },
      { name: "Abhinav Mishra", class: 11, level: 90, status: "excellent" },
      { name: "Abhinav Mishra", class: 11, level: 30, status: "inefficient" },
      { name: "Abhinav Mishra", class: 11, level: 20, status: "inefficient" },
      { name: "Abhinav Mishra", class: 11, level: 40, status: "optimal" },
      { name: "Abhinav Mishra", class: 11, level: 90, status: "excellent" },
    ]
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  const batchId = params.batchId;
  if (!batchId) {
    return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
  }

  try {
    const data = getStudentsData(batchId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
