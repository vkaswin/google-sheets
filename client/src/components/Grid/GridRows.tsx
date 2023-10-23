import classNames from "classnames";

import { IRow } from "@/types/Sheets";

type IGridRows = {
  rows: IRow[];
  selectedRowId?: string;
};

const GridRows = ({ rows, selectedRowId }: IGridRows) => {
  return (
    <div className="absolute z-10">
      {rows.map(({ id, height, width, y }) => {
        return (
          <div
            key={id}
            className={classNames(
              "absolute flex justify-center items-center border-l border-r border-b border-gray",
              id === selectedRowId ? "bg-light-blue" : "bg-white"
            )}
            style={{ height, width, top: y, left: 0 }}
          >
            <span
              className={classNames(
                "text-xs",
                id === selectedRowId
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

export default GridRows;
