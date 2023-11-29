import { useMemo, WheelEvent } from "react";
import { convertToTitle } from "@/utils";
import classNames from "classnames";

type IEditCellProps = {
  cell: ICell | null;
  data: ICellProps | null;
  onWheel: (event: WheelEvent<HTMLDivElement>) => void;
};

const EditCell = ({ cell, data, onWheel }: IEditCellProps) => {
  let { x, y, rowId, height, columnId, width } = cell || {};

  let { backgroundColor = "#FFFFFF" } = data ?? {};

  const cellId = useMemo(() => {
    if (!columnId) return "";
    return `${convertToTitle(columnId)}${rowId}`;
  }, [columnId]);

  return (
    <div
      className={classNames(
        "absolute flex border-1 outline outline-3 outline-light-blue p-[2px] z-10",
        {
          "hidden pointer-events-none": !cell,
        }
      )}
      style={{
        minWidth: width,
        minHeight: height,
        left: x,
        top: y,
        backgroundColor,
      }}
      onWheel={onWheel}
    >
      <div
        id="editor"
        className="w-full text-black text-[14px] outline outline-2 outline-dark-blue px-[5px]"
      ></div>
      <div className="absolute -top-7 left-0 bg-blue text-xs font-medium text-white rounded-sm px-2 py-1">
        {cellId}
      </div>
    </div>
  );
};

export default EditCell;
