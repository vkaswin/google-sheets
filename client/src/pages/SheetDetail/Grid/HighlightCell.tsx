import { MouseEvent } from "react";

import { ICell } from "@/types/Sheets";

type IActiveCellProps = {
  cell: ICell;
  onDoubleClick: () => void;
};

const HighlightCell = ({ cell, onDoubleClick }: IActiveCellProps) => {
  let { columnId, height, cellId, rowId, width, x, y } = cell;

  return (
    <div
      className="absolute flex text-sm bg-transparent border-2 border-blue"
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
      }}
      onDoubleClick={onDoubleClick}
    ></div>
  );
};

export default HighlightCell;
