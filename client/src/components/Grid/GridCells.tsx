import { Fragment } from "react";

import { ICell, IClickCell } from "@/types/Sheets";

type ICellsProps = {
  cells: Map<string, ICell>;
  onClickCell: IClickCell;
};

const GridCells = ({ cells, onClickCell }: ICellsProps) => {
  const handleClick = (cell: ICell) => {
    onClickCell(cell);
  };

  return (
    <Fragment>
      {[...cells].map(([cellId, cellData]) => {
        let {
          height,
          width,
          x,
          y,
          props: { content = "", backgroundColor = "white", color },
        } = cellData;

        return (
          <div
            key={cellId}
            className="absolute flex items-end text-sm border-b border-r border-gray p-1 overflow-hidden"
            style={{
              width,
              height,
              backgroundColor,
              color,
              left: x,
              top: y,
            }}
            onClick={() => handleClick(cellData)}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        );
      })}
    </Fragment>
  );
};

export default GridCells;
