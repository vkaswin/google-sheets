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
    <Fragment>
      <div
        className="absolute flex text-sm bg-transparent border-2 border-blue p-1"
        style={{
          left: x,
          top: y,
          width: width,
          height: height,
        }}
        onClick={handleClick}
        onDoubleClick={onDoubleClick}
      ></div>
      <div
        className="absolute flex justify-center items-center top-0 h-[var(--row-height)] bg-light-blue border border-light-gray"
        style={{ left: x, width }}
      >
        <span className="text-xs font-medium">{columnId}</span>
      </div>
      <div
        className="absolute flex justify-center items-center left-0 w-[var(--col-width)] bg-light-blue border border-light-gray"
        style={{ top: y, height }}
      >
        <span className="text-xs font-medium">{rowId}</span>
      </div>
    </Fragment>
  );
};

export default HighlightCell;
