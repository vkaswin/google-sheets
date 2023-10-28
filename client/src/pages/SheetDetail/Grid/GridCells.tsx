import { Fragment } from "react";

import { ICell, ICellDetails, ICellProps } from "@/types/Sheets";

type IGridCells = {
  cells: ICell[];
  cellDetails: ICellDetails;
};

const GridCells = ({ cells, cellDetails }: IGridCells) => {
  return (
    <Fragment>
      {cells.map((cell) => {
        let { columnId, height, cellId, rowId, width, x, y } = cell;

        let {
          color = "#000000",
          backgroundColor = "#FFFFFF",
          content = "",
        } = cellDetails[cellId] ?? {};

        return (
          <div
            key={cellId}
            className="absolute border-r border-b border-gray text-sm p-1"
            style={{ left: x, top: y, width, height, color, backgroundColor }}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        );
      })}
    </Fragment>
  );
};

export default GridCells;
