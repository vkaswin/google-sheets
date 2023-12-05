import { useMemo } from "react";
import { convertToTitle } from "@/utils";

type IHighLightColumnProps = {
  column: IColumn;
};

const HighLightColumn = ({
  column: { columnId, height, width, x, y },
}: IHighLightColumnProps) => {
  let left = `calc(${x}px - var(--col-width))`;

  const title = useMemo(() => {
    return convertToTitle(columnId);
  }, [columnId]);

  return (
    <div className="absolute left-[var(--col-width)] top-0 w-[calc(100%-var(--col-width))] h-[var(--row-height)] overflow-hidden z-10">
      <div
        className="absolute flex justify-center items-center bg-dark-blue"
        style={{ left, top: y, width, height }}
      >
        <span className="text-white text-xs font-medium">{title}</span>
      </div>
    </div>
  );
};

export default HighLightColumn;
