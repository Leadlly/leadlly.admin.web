import General from "./generalType";

export default async function Student_Portfolio() {
  return (
    <div className="flex  justify-between ">
      <div className="flex-grow">
      <General
        role={"Student"}
        color={"bg-green-100"}
        text={"text-green-600"}
        title={"Students Overview"}
        total_title={"Total Students"}
        course_title={"Active Courses"}
        average_atten_title={"Average Attendance"}
        performance_title_index={"Performance Index"}
        text_color={"text-green-600"}
        size={'6'}
        total_number={'2284'}
        active_course={'84'}
        average_performance={"98 %"}
        performance_index={'9.0 / 10'}
        border_color={"border-green-500"}
      />
      </div>
     <div className="flex-grow">
     <General
        role={"Teacher"}
        color={"bg-blue-100"}
        text={"text-blue-600"}
        title={"Teachers Overview"}
        text_color={"text-blue-500"}
        total_title={"Total Teachers"}
        course_title={"Depatrments"}
        average_atten_title={"Active Classes"}
        performance_title_index={"Satisfaction Rate"}
        size={'6'}
        total_number={'24'}
        active_course={'14'}
        average_performance={"98 %"}
        performance_index={'9.0 / 10'}
        border_color={"border-blue-500"}
      />
     </div>
     
    </div>
  );
}
