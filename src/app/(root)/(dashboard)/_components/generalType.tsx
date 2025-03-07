import Attendance_Icon from "./icons/attendance_Icon";
import GraphIcon from "./icons/graphIcon";
import Group_Icon from "./icons/groupIcon";
import Performance_Icon from "./performance-icon";
import Student_Teacher_Button from "./Student_Teacher_Button";
import Title from "./title";
import { SmallTitle } from "./title";
interface general {
  role?:string,
  color?:string,
  text?:string,
  title?: string;
  size?: string;
  text_color?: string;
  border_color?: string;
  total_number?: string;
  active_course?: string;
  average_performance?: string;
  performance_index?: string;
  total_title?:string;
  course_title?:string;
  average_atten_title?:string;
  performance_title_index?:string
}
export default async function General({
  role,
  color,
  text,
  title,
  size,
  text_color,
  border_color,
  total_title,
  course_title,
  average_atten_title,
  performance_title_index,
  total_number,
  active_course,
  average_performance,
  performance_index,
}: general) {
  return (
    <div className={`flexrounded-2xl border-2 rounded-xl border-solid ${border_color} px-8 py-2 m-8 `}>
      <div className="m-2">
        <Headline title={title} />
      </div>

      <div className="flex  gap-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <Number_stu_tea
            size={size}
            text_color={text_color}
            total_number={total_number}
            total_title={total_title}
          />
          <Atten_Class
            title={title}
            size={size}
            text_color={text_color}
            average_atten_title={average_atten_title}
            average_performance={average_performance}
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
        <Subject_dept
            title={title}
            size={size}
            text_color={text_color}
            course_title={course_title}
            active_course={active_course}
          />
          
          <Performance
            title={title}
            size={size}
            text_color={text_color}
            performance_title_index={performance_title_index}
            performance_index={performance_index}
          />
        </div>
         
      </div>
      <div className="flex flex-col">
        <Student_Teacher_Button role={role ?? "default"} color={color ?? "default"} text={text ?? "default"}/>
        </div>
    </div>
  );
}
function Headline({ title }: general) {
  return (
    <div>
      <Title title={title ?? "Default Title"} />
    </div>
  );
}
function Number_stu_tea({ size, text_color, total_number,total_title }: general) {
  return (
    <div className="flex flex-col justify-center items-start">
        <SmallTitle title={total_title ?? "Total Student"} /> 
     <div className="flex jusatify-center gap-2 text-xl ml-4">
        <Group_Icon text_color={text_color ?? "green"} size={size ?? "6"} />
        <div>{total_number}</div>
      </div>
    </div>
  );
}
function Subject_dept({ active_course ,text_color,size,course_title}: general) {
  return (
    <div className="flex flex-col justify-center items-start ">
        <SmallTitle title={course_title ?? "default"} />
       <div className="flex jusatify-center gap-2 text-xl ml-4">
              <GraphIcon text_color={text_color ?? "green"} size={size ?? "6"} />
              <div>{active_course}</div>
        </div>
    </div>
  );
}
function Atten_Class({ average_performance,text_color,size, average_atten_title }: general) {
  return (
    <div className="flex flex-col justify-items-start ">
      <SmallTitle title={ average_atten_title ?? "default"} />
      <div className="flex jusatify-center gap-2 text-xl ml-4">
        <Attendance_Icon  text_color={text_color ?? "green"} size={size ?? "6"} />
        <div>{average_performance}</div>
     </div>
      
    </div>
  );
}
function Performance({ performance_index ,text_color,size,performance_title_index}: general) {
  return (
    <div className="flex flex-col justify-center items-start">
      <SmallTitle title={performance_title_index ?? "default"} />
      <div className="flex jusatify-center gap-2 text-xl ml-4">
        <Performance_Icon text_color={text_color ?? "green"} size={size ?? "6"} />
        <div>{performance_index}</div>
      </div>
      
    </div>
  );
}
