"use client";
import Image from "next/image";
import {
  MapPin,
  Mail,
  Phone,
  Users,
  BookOpen,
  Clipboard,
  Smile,
} from "lucide-react";
import Card from "./_components/Card";
import Button from "./_components/Button";
import { Edit } from "lucide-react"; // Import the Edit icon

export default function Home() {
  return (
    <>
      <div className="flex-row justify-between border-black">
        <div className="flex justify-between items-center border-black mb-6 mt-10">
          <h1 className="text-3xl font-bold">
            Institute Overview & Management
          </h1>
          <Button
            label="Edit"
            onClick={() => {}}
            children={<Edit className="ml-2" size={16} />}
            className="bg-purple-500 text-white"
          />
        </div>
      </div>

      <section className="border rounded-lg p-6 mb-6 flex flex-col md:flex-row justify-between items-center bg-purple-50">
        <div className="flex items-center mb-4 md:mb-0">
          <Image
            src="/image.png"
            alt="Institute Logo"
            width={143}
            height={160}
          />
          <div className="ml-6">
            <p className="text-sm text-xl">Established in 2001</p>
            <h1 className="text-2xl font-bold">Chaitanya Bharathi Institute</h1>
            <p className="text-sm text-xl">Institute Code: 21XYZ1234</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-auto">
          <div className="flex items-center">
            <MapPin className="mr-2" />
            <div>
              <p className="text-xl font-semibold text-custom-gray">Address:</p>
              <p className="text-xl">123, Main Street, City, Country</p>
            </div>
          </div>
          <div className="flex items-center ml-14">
            <Phone className="mr-2" />
            <div>
              <p className="text-xl font-semibold text-custom-gray">Contact:</p>
              <p className="text-xl">+1234567890</p>
            </div>
          </div>
          <div className="flex items-center">
            <Mail className="mr-2" />
            <div>
              <p className="text-xl font-semibold text-custom-gray">Email:</p>
              <p className="text-xl">info@institute.com</p>
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-col w-full md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Card
          title="Students Overview"
          className="bg-green-50 w-full md:w-2/3 lg:w-2/3 border-green-600"
        >
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <p className="text-xl">Total Students</p>
              <div className="flex items-center mt-2 mr-8">
                <Users className="mr-2 text-student-green-text" size={20} />
                <p className="text-2xl font-bold">2284</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl">Active Courses</p>
              <div className="flex items-center mt-2 mr-12">
                <BookOpen className="mr-2 text-student-green-text" size={20} />
                <p className="text-2xl font-bold">84</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex flex-col items-center">
              <p className="text-xl">Average Attendance</p>
              <div className="flex items-center mt-2 mr-16">
                <Clipboard className="mr-2 text-student-green-text" size={20} />
                <p className="text-2xl font-bold">98%</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-xl">Performance Index</p>
              <div className="flex items-center mt-2 ml-10">
                <Smile className="mr-2 text-student-green-text" size={20} />
                <p className="text-2xl font-bold">9.0/10</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {}}
            className="mt-4 bg-student-green text-student-green-text w-full font-bold text-xl"
          >
            <Image src={'/📚 View Students.png'} width={150} height={150} alt="View students"/>
          </Button>
        </Card>
        <Card
          title="Teachers Overview"
          className="bg-blue-50 w-full md:w-2/3 lg:w-2/3 border-blue-500"
        >
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <p className="text-xl">Total Teachers</p>
              <div className="flex items-center mt-2 mr-14">
                <Users className="mr-2 text-teacher-blue-text" size={20} />
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-xl">Departments</p>
              <div className="flex items-center mt-2 mr-12">
                <BookOpen className="mr-2 text-teacher-blue-text" size={20} />
                <p className="text-2xl font-bold">14</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex flex-col items-center">
              <p className="text-xl">Active Classes</p>
              <div className="flex items-center mt-2 mr-14 justify-start">
                <Clipboard className="mr-2 text-teacher-blue-text" size={20} />
                <p className="text-2xl font-bold">98</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-xl">Satisfaction Rate</p>
              <div className="flex items-center justify-end mt-2">
                <Smile className="mr-2 text-teacher-blue-text" size={20} />
                <p className="text-2xl font-bold">9.0/10</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {}}
            className="mt-4 bg-teacher-button-blue text-teacher-blue-text w-full font-bold text-xl"
          >
              <Image src={'/🎓 View Teachers.png'} width={150} height={150} alt="View students"/>
          </Button>
        </Card>
      </div>
    </>
  );
}
