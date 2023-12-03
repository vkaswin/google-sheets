import { useMemo } from "react";
import classNames from "classnames";
import useSheet from "@/hooks/useSheet";
import { convertToTitle } from "@/utils";

const EditCell = () => {
  let { editCell, getCellById } = useSheet();

  let { columnId, height, rowId, width, x, y } = editCell || {};

  let { background = "#FFFFFF", color } = getCellById(editCell?.cellId) || {};

  const cellId = useMemo(() => {
    if (!columnId) return "";
    return `${convertToTitle(columnId)}${rowId}`;
  }, [columnId]);

  return (
    <div
      className={classNames(
        "absolute flex border-1 outline outline-3 outline-light-blue leading-5 p-[2px] z-10",
        {
          "hidden pointer-events-none": !editCell,
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
        className="w-full text-black text-[14px] outline outline-2 outline-dark-blue px-[5px]"
        style={{ background, color }}
      ></div>
      <div className="absolute -top-7 left-0 bg-blue text-xs font-medium text-white rounded-sm px-2 py-1">
        {cellId}
      </div>
    </div>
  );
};

export default EditCell;
