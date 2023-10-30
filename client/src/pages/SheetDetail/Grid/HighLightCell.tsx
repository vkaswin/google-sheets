import { Fragment } from "react";
import { convertToTitle } from "@/utils";

import { ICell } from "@/types/Sheets";

type IActiveCellProps = {
  selectedCell: ICell;
  onDoubleClick: () => void;
};

const HighlightCell = ({ selectedCell, onDoubleClick }: IActiveCellProps) => {
  let { columnId, height, cellId, rowId, width, x, y } = selectedCell;

  return (
    <Fragment>
      <div
        className="absolute flex text-sm bg-transparent border-2 border-blue p-1 z-10"
        style={{
          left: x,
          top: y,
          width: width,
          height: height,
        }}
        onDoubleClick={onDoubleClick}
      ></div>
      <div
        className="absolute flex justify-center items-center top-0 h-[var(--row-height)] bg-light-blue border border-light-gray"
        style={{ left: x, width }}
      >
        <span className="absolute text-xs font-medium">
          {convertToTitle(columnId)}
        </span>
      </div>
      <div
        className="absolute flex justify-center items-center left-0 w-[var(--col-width)] bg-light-blue border border-light-gray"
        style={{
          top: y,
          height,
        }}
      >
        <span className="absolute text-xs font-medium">{rowId}</span>
      </div>
    </Fragment>
  );
};

export default HighlightCell;
