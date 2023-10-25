import { useRef, MouseEvent, WheelEvent } from "react";

import { ICell, ICellProps } from "@/types/Sheets";

type IEditCell = {
  cell: ICell;
  data: ICellProps;
  onWheel: (event: WheelEvent<HTMLDivElement>) => void;
};

const EditCell = ({ cell, data, onWheel }: IEditCell) => {
  const inputRef = useRef<HTMLDivElement | null>(null);

  let { x, y, rowId, height, id, columnId, width } = cell;

  let { color, backgroundColor = "white", content = "" } = data ?? {};

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleInputRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    ref.focus();
  };

  return (
    <div
      className="absolute flex border-2 border-dark-blue outline outline-3 outline-light-blue p-1 z-10"
      style={{
        width,
        height,
        left: x,
        top: y,
        backgroundColor,
      }}
      onClick={handleClick}
      onWheel={onWheel}
    >
      <div
        ref={handleInputRef}
        className="w-full h-full outline-none text-xs"
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <div className="absolute -top-7 left-0 bg-blue text-xs font-medium text-white rounded-sm px-2 py-1">
        {id}
      </div>
    </div>
  );
};

export default EditCell;
