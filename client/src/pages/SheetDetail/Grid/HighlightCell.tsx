import { Fragment } from "react";
import { convertToTitle } from "@/utils";

import { ICell, IColumn, IRow } from "@/types/Sheets";

type IActiveCellProps = {
  selectedGrid: { cell: ICell; row: IRow; column: IColumn };
  onDoubleClick: () => void;
};

const HighlightCell = ({
  selectedGrid: { cell, column, row },
  onDoubleClick,
}: IActiveCellProps) => {
  let { columnId, height, cellId, rowId, width, x, y } = cell;

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
        className="absolute top-0 h-[var(--row-height)] bg-light-blue border border-light-gray"
        style={{ left: x, width }}
      >
        <span
          className="absolute text-xs font-medium"
          style={{ left: column.width / 2 - 5, top: column.height / 2 - 10 }}
        >
          {convertToTitle(columnId)}
        </span>
      </div>
      <div
        className="absolute left-0 w-[var(--col-width)] bg-light-blue border border-light-gray"
        style={{
          top: y,
          height,
        }}
      >
        <span
          className="absolute text-xs font-medium"
          style={{ left: row.width / 2 - 5, top: row.height / 2 - 10 }}
        >
          {rowId}
        </span>
      </div>
    </Fragment>
  );
};

export default HighlightCell;
