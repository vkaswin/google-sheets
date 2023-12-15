import { Fragment, useMemo } from "react";
import classNames from "classnames";

type IHighLightSearchCellsProps = {
  cells: ICell[];
  highLightCells: string[];
  activeHighLightIndex: number;
  getCellById: (cellId: string) => ICellDetail | undefined;
};

const HighLightSearchCells = ({
  cells,
  highLightCells,
  activeHighLightIndex,
  getCellById,
}: IHighLightSearchCellsProps) => {
  const cellIds = useMemo(() => {
    return new Set(highLightCells);
  }, [highLightCells]);

  return (
    <Fragment>
      {cells.map(({ cellId, height, width, x, y }) => {
        let cellData = getCellById(cellId);

        if (!cellData || !cellIds.has(cellData._id)) return null;

        let left = `calc(${x}px - var(--col-width))`;
        let top = `calc(${y}px - var(--row-height))`;

        return (
          <div
            key={cellId}
            className={classNames(
              "absolute pointer-events-none",
              cellData._id === highLightCells[activeHighLightIndex]
                ? "bg-[rgba(55,190,95,.702)] shadow-[0_0_0_2px_#146c2e] border border-white"
                : "bg-[rgba(109,213,140,.4)]"
            )}
            style={{
              width,
              height,
              left,
              top,
            }}
          ></div>
        );
      })}
    </Fragment>
  );
};

export default HighLightSearchCells;
