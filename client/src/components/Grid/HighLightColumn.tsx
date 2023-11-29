import { convertToTitle } from "@/utils";

type IHighLightColumn = {
  selectedColumn: IColumn;
};

const HighLightColumn = ({ selectedColumn }: IHighLightColumn) => {
  const { columnId, height, width, x, y } = selectedColumn;

  let left = `calc(${x}px - var(--col-width))`;

  return (
    <div className="absolute left-[var(--col-width)] top-0 w-[calc(100%-var(--col-width))] h-[var(--row-height)] overflow-hidden z-10">
      <div
        className="absolute flex justify-center items-center bg-dark-blue"
        style={{ left, top: y, width, height }}
      >
        <span className="text-white text-xs font-medium">
          {convertToTitle(columnId)}
        </span>
      </div>
    </div>
  );
};

export default HighLightColumn;
