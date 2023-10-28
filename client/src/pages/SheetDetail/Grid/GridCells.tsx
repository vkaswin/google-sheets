import { Fragment } from "react";

import { ICell, ICellProps } from "@/types/Sheets";

type IGridCells = {
  cells: Record<string, ICell>;
  data: Record<string, ICellProps>;
};

const GridCells = ({ cells, data }: IGridCells) => {
  return (
    <Fragment>
      {Object.values(cells).map((cell) => {
        let { columnId, height, id, rowId, width, x, y } = cell;

        let {
          color = "#000000",
          backgroundColor = "#FFFFFF",
          content = "",
        } = data[id] ?? {};

        return (
          <div
            key={id}
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
