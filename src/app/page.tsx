import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Institute Overview & Management</h1>
        <Button variant="default" className="bg-purple-500 hover:bg-purple-600">
          <span className="mr-2">✏️</span> Edit
        </Button>
      </div>

      <Card className="mb-8 bg-purple-50 border-pink-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                  <img
                    src="/university-logo.png"
                    alt="University Logo"
                    className="w-24 h-24"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600">Established in 2001</p>
                  <h2 className="text-2xl font-bold">
                    Chaitanya Bharathi Institute
                  </h2>
                  <p className="text-gray-600">Institute Code: 21XYZ1234</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <p className="text-gray-600">Address:</p>
                <p>123, Main Street, City, Country</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p>info@institute.com</p>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div>
                <p className="text-gray-600">Contact:</p>
                <p>+1234567890</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Students Overview</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">2284</p>
              </div>
              <div>
                <p className="text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold">84</p>
              </div>
              <div>
                <p className="text-gray-600">Average Attendance</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
              <div>
                <p className="text-gray-600">Performance Index</p>
                <p className="text-2xl font-bold">9.0/10</p>
              </div>
            </div>
            <Link href="/batches">
              <Button className="w-full bg-green-50 text-green-600 hover:bg-green-100">
                📚 View Students
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Teachers Overview</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div>
                <p className="text-gray-600">Departments</p>
                <p className="text-2xl font-bold">14</p>
              </div>
              <div>
                <p className="text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold">98</p>
              </div>
              <div>
                <p className="text-gray-600">Satisfaction Rate</p>
                <p className="text-2xl font-bold">9.0/10</p>
              </div>
            </div>
            <Button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100">
              👩‍🏫 View Teachers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
