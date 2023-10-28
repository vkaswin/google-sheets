import { Fragment, MouseEvent } from "react";

import { ICell, ICellProps } from "@/types/Sheets";

type IActiveCellProps = {
  cell: ICell;
  onDoubleClick: () => void;
};

const HighlightCell = ({ cell, onDoubleClick }: IActiveCellProps) => {
  let { columnId, height, id, rowId, width, x, y } = cell;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="absolute flex text-sm bg-transparent border-2 border-blue"
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
      }}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
    ></div>
  );
};

export default HighlightCell;
