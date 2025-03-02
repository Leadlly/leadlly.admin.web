
# Leadlly Admin Web

## Overview
Leadlly Admin Web is a comprehensive administration platform for educational institutions. It provides tools for managing students, teachers, batches, and courses with an intuitive interface designed for educational administrators.

## Features

### Dashboard
Get a quick overview of your institution's key metrics:
- Total students and teachers
- Active courses and classes
- Performance metrics and attendance rates

![Dashboard](/Updated%20Images/dashboard.png)

### Course Management
- Create, edit, and delete courses
- Assign teachers to each course
- View course schedules and attendance

![Student Batches](/Updated%20Images/batches.png)

### Student Management
- View and manage all student batches
- Filter students by standard, subject, and teacher
- Track student attendance and performance
- Detailed student profiles

![Student List](/Updated%20Images/List_students.png)

### Teacher Management
- Comprehensive teacher profiles
- Track teacher performance and satisfaction rates
- View classes taught by each teacher
- Monitor student attendance in teacher's classes

![Teacher Profile](/Updated%20Images/teacher_profile.png)

## Technology Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Hooks
- **API**: Next.js API Routes
- **Styling**: Tailwind CSS for responsive design

## API Implementation
The application uses Next.js API Routes to create serverless API endpoints that handle data operations. These API routes are located in the `src/app/api` directory and follow RESTful principles.

### API Architecture
Leadlly Admin Web implements a modern API architecture using Next.js App Router's route handlers, which provide:
- **Serverless Functions**: Each API endpoint runs as a serverless function
- **TypeScript Integration**: Full type safety for request and response handling
- **Route Parameters**: Dynamic routing with path and query parameter support
- **Error Handling**: Standardized error responses

### Available API Endpoints

#### Batches API
- **GET /api/batches**  
  - Description: Retrieves a list of all batches grouped by standard  
  - Query Parameters:  
    - `standard`: Filter batches by standard name (e.g., "11th standard")  
    - `subject`: Filter batches by subject name (e.g., "Physics")  
    - `teacher`: Filter batches by teacher name (e.g., "Dr. Sarah Wilson")  
  - Response: JSON object containing filtered batches grouped by standard

**Example request:**
```
GET /api/batches?standard=11th&subject=Physics
```

**Example response:**
```json
{
  "standards": [
    {
      "name": "11th standard",
      "batches": [
        {
          "id": "11-omega-1",
          "name": "Omega",
          "standard": "11th Class",
          "subjects": ["Chemistry", "Physics", "Biology"],
          "totalStudents": 120,
          "maxStudents": 180,
          "teacher": "Dr. Sarah Wilson"
        }
        // More batches...
      ]
    }
  ]
}
```

### Implementation Details
The API routes are implemented using Next.js App Router's route handlers. Each API endpoint is defined in a route.ts file within the corresponding directory structure.

**Request Handling (Example from `src/app/api/batches/route.ts`):**
```typescript
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const standard = searchParams.get('standard');
    const subject = searchParams.get('subject');
    const teacher = searchParams.get('teacher');
    
    // Process and filter data
    // ...
    
    return NextResponse.json(filteredData, { status: 200 });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batches' },
      { status: 500 }
    );
  }
}
```

### Data Handling
Currently, the application uses mock data for demonstration purposes. In a production environment, these API routes would connect to a database or external API service.

**Mock data example:**
```typescript
const batchesData = {
  standards: [
    {
      name: "11th standard",
      batches: [
        // Batch data...
      ]
    }
  ]
};
```

### Error Handling
All API routes implement consistent error handling to ensure robust operation:

```typescript
try {
  // API logic
} catch (error) {
  console.error('Error:', error);
  return NextResponse.json(
    { error: 'Error message' },
    { status: 500 }
  );
}
```

### Future API Enhancements
Planned API enhancements include:
- Authentication and authorization
- CRUD operations for all resources (students, teachers, courses)
- Pagination for large data sets
- Advanced filtering and search capabilities
- Real-time updates using webhooks or WebSockets

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation
Clone the repository:
```bash
git clone https://github.com/your-username/leadlly.admin.web.git
cd leadlly.admin.web
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open `URL_ADDRESS:3000` in your browser

## Project Structure
```
leadlly.admin.web/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── (root)/      # Main application routes
│   │   │   ├── (dashboard)/  # Dashboard components
│   │   │   ├── batches/      # Batch management
│   │   │   └── teacher/      # Teacher management
│   │   └── api/         # API routes
│   ├── components/      # Shared components
│   └── styles/          # Global styles
├── Updated Images/      # Project screenshots
└── README.md            # Project documentation
```

This update adds a comprehensive API section to your README.md that explains:
1. The API architecture using Next.js API Routes
2. Available endpoints with examples
3. Implementation details including request handling, data handling, and error handling
4. Future API enhancement plans

The documentation is based on the existing implementation in your `src/app/api/batches/route.ts` file, which demonstrates how the API routes are structured in your project.
