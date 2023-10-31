import { Fragment } from "react";
import { convertToTitle } from "@/utils";

import { ICell } from "@/types/Sheets";

type IActiveCellProps = {
  selectedCell: ICell;
  onDoubleClick: () => void;
};

const HighlightCell = ({ selectedCell, onDoubleClick }: IActiveCellProps) => {
  let { columnId, height, cellId, rowId, width, x, y } = selectedCell;

  let left = `calc(${x}px - var(--col-width))`;
  let top = `calc(${y}px - var(--row-height))`;

  return (
    <div
      className="absolute flex text-sm bg-transparent border-2 border-blue p-1 z-10"
      style={{
        left,
        top,
        width: width,
        height: height,
      }}
      onDoubleClick={onDoubleClick}
    ></div>
  );
};

export default HighlightCell;
