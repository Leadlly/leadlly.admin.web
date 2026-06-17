import { cn } from "@/lib/utils";

const Progressbar = ({

  value,
  indicatorClassName,
  progressClassName,
}: {
  value?: number;
  indicatorClassName?: string;
  progressClassName?: string;
}) => {
  return (
    <div className={cn("rounded md:h-[6px] h-[3px] md:w-16 w-[40px] bg-[#C1C1C1]", progressClassName)}>
      <div
        style={{ width: `${value}%` }}
        className={cn(
          "h-full rounded bg-[#0075FF]",
          indicatorClassName
        )}
      ></div>
    </div>
  );
};
export default Progressbar;
