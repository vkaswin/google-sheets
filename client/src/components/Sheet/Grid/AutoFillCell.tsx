import { Fragment } from "react";

type IAutoFillCellProps = {
  cells: ICell[];
};

const AutoFillCell = ({ cells }: IAutoFillCellProps) => {
  return (
    <Fragment>
      {/* {cells.map(({ cellId, columnId, height, rowId, width, x, y }) => {
        let left = `calc(${x}px - var(--col-width))`;
        let top = `calc(${y}px - var(--row-height))`;
        return (
          <div
            key={cellId}
            className="absolute bg-transparent border border-dashed border-black"
            style={{ width, height, top, left }}
          ></div>
        );
      })} */}
    </Fragment>
  );
};

export default AutoFillCell;
