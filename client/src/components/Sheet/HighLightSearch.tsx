import { Fragment, useMemo } from "react";
import classNames from "classnames";
import useSheet from "@/hooks/useSheet";

const HighLightSearch = () => {
  const {
    grid: { cells },
    highLightCellIds,
    activeSearchIndex,
  } = useSheet();

  const cellIds = useMemo(() => new Set(highLightCellIds), [highLightCellIds]);

  if (!highLightCellIds.length) return;

  return (
    <Fragment>
      {cells.map(({ cellId, columnId, height, rowId, width, x, y }) => {
        if (!cellIds.has(cellId)) return null;

        let left = `calc(${x}px - var(--col-width))`;
        let top = `calc(${y}px - var(--row-height))`;

        return (
          <div
            key={cellId}
            className={classNames(
              "absolute",
              cellId === highLightCellIds[activeSearchIndex]
                ? "bg-[rgba(55,190,95,.702)] shadow-[0_0_0_2px_#146c2e]"
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
