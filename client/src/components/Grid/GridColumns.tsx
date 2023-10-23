import classNames from "classnames";

import { IColumn } from "@/types/Sheets";

type IGridColumns = {
  columns: IColumn[];
  selectedColumnId?: string;
};

const GridColumns = ({ columns, selectedColumnId }: IGridColumns) => {
  return (
    <div className="absolute z-10">
      {columns.map(({ id, width, height, x, y }) => {
        return (
          <div
            key={id}
            className={classNames(
              "absolute flex justify-center items-center border-t border-b border-r border-gray",
              id === selectedColumnId ? "bg-light-blue" : "bg-white"
            )}
            style={{ width, height, left: x, top: y }}
          >
            <span
              className={classNames(
                "text-xs",
                id === selectedColumnId
                  ? "font-medium text-black"
                  : "text-light-gray"
              )}
            >
              {id}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default GridColumns;
