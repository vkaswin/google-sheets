import { Fragment, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { ICell, ICellProps } from "@/types/Sheets";

type IActiveCellProps = {
  cell: ICell;
  data: ICellProps;
};

const ActiveCell = ({ cell, data }: IActiveCellProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);

  let { columnId, height, id, rowId, width, x, y } = cell;

  let { backgroundColor, color, content = "", text } = data ?? {};

  useEffect(() => {
    if (!isEdit) return;
    setIsEdit(false);
  }, [cell]);

  useEffect(() => {
    if (!isEdit || !inputRef.current) return;
    inputRef.current.focus();
  }, [isEdit]);

  const handleDoubleClick = () => {
    setIsEdit(true);
  };

  return (
    <Fragment>
      <div
        className={classNames(
          "absolute flex text-sm bg-transparent border-2 p-1",
          isEdit
            ? "border-dark-blue outline outline-3 outline-light-blue"
            : "border-blue"
        )}
        style={{
          left: x,
          top: y,
          width: width,
          height: height,
          backgroundColor,
          color,
        }}
        onDoubleClick={handleDoubleClick}
      >
        <div
          ref={inputRef}
          className={classNames("flex outline-none overflow-hidden", {
            "items-end": !isEdit,
          })}
          contentEditable={isEdit}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>

      <div
        className="absolute flex justify-center items-center top-0 h-[var(--row-height)] bg-light-blue border border-light-gray"
        style={{ left: x, width }}
      >
        <span className="text-xs font-medium">{columnId}</span>
      </div>

      <div
        className="absolute flex justify-center items-center left-0 w-[var(--col-width)] bg-light-blue border border-light-gray"
        style={{ top: y, height }}
      >
        <span className="text-xs font-medium">{rowId}</span>
      </div>
    </Fragment>
  );
};

export default ActiveCell;
