import { Fragment, useMemo, useState } from "react";
import classNames from "classnames";

import { ICell } from "@/types/Sheets";

type IHighLightSearch = {
  activeIndex: number;
  cellIds: string[];
  visibleCells: ICell[];
};

const HighLightSearch = ({
  activeIndex,
  cellIds,
  visibleCells,
}: IHighLightSearch) => {
  const highLightCellIds = useMemo(() => new Set(cellIds), [cellIds]);

  return (
    <Fragment>
      {visibleCells.map(({ cellId, columnId, height, rowId, width, x, y }) => {
        if (!highLightCellIds.has(cellId)) return null;

        let left = `calc(${x}px - var(--col-width))`;
        let top = `calc(${y}px - var(--row-height))`;

        return (
          <div
            key={cellId}
            className={classNames(
              "absolute",
              cellId === cellIds[activeIndex]
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

export default HighLightSearch;
