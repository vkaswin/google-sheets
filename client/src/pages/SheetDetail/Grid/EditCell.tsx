import { useRef, MouseEvent, WheelEvent, useEffect } from "react";

import { ICell, ICellProps } from "@/types/Sheets";

type IEditCell = {
  cell: ICell;
  data: ICellProps;
  onWheel: (event: WheelEvent<HTMLDivElement>) => void;
};

const EditCell = ({ cell, data, onWheel }: IEditCell) => {
  const inputRef = useRef<HTMLDivElement | null>(null);

  let { x, y, rowId, height, id, columnId, width } = cell;

  let {
    color = "#000000",
    backgroundColor = "#FFFFFF",
    content = "",
  } = data ?? {};

  useEffect(() => {
    if (!inputRef.current) return;
    moveCaretToEnd(inputRef.current);
  }, [cell]);

  const moveCaretToEnd = (ref: HTMLDivElement) => {
    let selection = window.getSelection();

    if (!selection) return;

    let range = document.createRange();
    range.setStart(ref, ref.childNodes.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div
      className="absolute flex border-1 outline outline-3 outline-light-blue p-[2px] z-10"
      style={{
        width,
        height,
        left: x,
        top: y,
        backgroundColor,
        color,
      }}
      onWheel={onWheel}
    >
      <div
        ref={inputRef}
        className="w-full h-full text-sm outline outline-2 outline-dark-blue p-[2px]"
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