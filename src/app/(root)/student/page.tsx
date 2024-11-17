import Header from "@/app/(root)/student/_components/Header"
import StatsCards from "@/app/(root)/student/_components/StatsCards"
import Graph from "@/app/(root)/student/_components/Graph"
import Goals from "@/app/(root)/student/_components/Goals"
import WeeklyProgress from "@/app/(root)/student/_components/WeeklyProgress"
import StudentDetails from "@/app/(root)/student/_components/StudentDetails"

const Student: React.FC = () => {
    return(
        <div className="relative h-full flex flex-col justify-start gap-3 xl:gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Header />
          </div>
        </div>
    
        <div className="flex-1">
          <h1>Hii,</h1>
          <h1>Welcome to Student Dashboard</h1>
          <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <StatsCards />
              <div className="space-y-4">
                <Graph />
              </div>
            </div>
    
            <div className="w-full lg:w-1/2 space-y-4">
              <Goals />
              <WeeklyProgress />
            </div>
                <div className="w-full mb-6"> 
                  <StudentDetails />
                </div>
          </div>
        </div>
      </div>
    )
}
export default Student;