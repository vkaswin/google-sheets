import { useMemo } from "react";
import classNames from "classnames";
import { convertToTitle } from "@/utils";

type IEditCellProps = {
  cell: ICell | null;
  data?: ICellProps;
};

const EditCell = ({ cell, data }: IEditCellProps) => {
  let { columnId, height, rowId, width, x, y } = cell || {};

  let { background = "#FFFFFF" } = data || {};

  const cellId = useMemo(() => {
    if (!columnId) return "";
    return `${convertToTitle(columnId)}${rowId}`;
  }, [columnId]);

  return (
    <div
      className={classNames(
        "absolute flex border-1 outline outline-3 outline-light-blue leading-5 p-[2px] z-10",
        {
          "hidden pointer-events-none": !cell,
        }
      )}
      style={{
        minWidth: width,
        minHeight: height,
        left: x,
        top: y,
      }}
    >
      <div
        id="editor"
        className="w-full text-black text-[15px] outline outline-2 outline-dark-blue px-[5px] leading-tight"
        style={{ background }}
      ></div>
      <div className="absolute -top-7 left-0 bg-blue text-xs font-medium text-white rounded-sm px-2 py-1">
        {cellId}
      </div>
    </div>
  );
};

export default EditCell;
