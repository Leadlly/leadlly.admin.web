import Student_Icon from "./Student_Icon";
import Teacher_Icon from "./teacher_icon";

interface student_teacher_button_icon {
  role: string;
  color: string;
  text: string;
}
export default async function Student_Teacher_Button({
  role,
  color,
  text,
}: student_teacher_button_icon) {
  return (
    <div
      className={`flex items-center justify-center ${color}  px-8 py-2  m-3 rounded-lg  gap-2 h-11  ${text} font-sans text-xl `}
    >
    {role === 'Student' ? < Student_Icon/> : null}
    {role === 'Teacher' ? <Teacher_Icon/> : null}
      <button>View {role} </button>
    </div>
  );
}
