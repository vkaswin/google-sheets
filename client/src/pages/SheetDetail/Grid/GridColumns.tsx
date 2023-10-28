import { Fragment, PointerEvent, useRef, useState } from "react";

import { IColumn } from "@/types/Sheets";
import classNames from "classnames";

type IGridColumns = {
  columns: IColumn[];
  selectedId?: string;
  onClick: (columnId: string) => void;
  onResize: (columnId: string, value: number) => void;
};

const GridColumns = ({
  columns,
  selectedId,
  onClick,
  onResize,
}: IGridColumns) => {
  const [selectedColumn, setSelectedColumn] = useState<IColumn | null>(null);

  const [showLine, setShowLine] = useState(false);

  const resizeRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<number | null>(null);

  const handlePointerDown = (event: PointerEvent) => {
    if (!resizeRef.current || !selectedColumn) return;

    pointerRef.current = event.pageX;
    resizeRef.current.setPointerCapture(event.pointerId);
    resizeRef.current.addEventListener("pointermove", handlePointerMove);
    resizeRef.current.addEventListener("pointerup", handlePointerUp, {
      once: true,
    });
    setShowLine(true);
  };

  const handlePointerMove = (event: any) => {
    if (!resizeRef.current || !pointerRef.current || !selectedColumn) return;
    let { pageX } = event as PointerEvent;
    let width = selectedColumn.width + -(pointerRef.current - pageX);
    if (width < 50) return;
    setSelectedColumn({ ...selectedColumn, width });
  };

  const handlePointerUp = (event: any) => {
    if (!resizeRef.current || !selectedColumn || !pointerRef.current) return;

    let { pageX } = event as PointerEvent;
    resizeRef.current.removeEventListener("pointermove", handlePointerMove);

    let width = selectedColumn.width + -(pointerRef.current - pageX);
    onResize(selectedColumn.id, Math.max(50, width));
    pointerRef.current = null;
    setSelectedColumn(null);
    setShowLine(false);
  };

  const handleMouseEnter = (column: IColumn) => {
    setSelectedColumn({ ...column });
  };

  return (
    <Fragment>
      <div className="absolute left-0 top-0 w-full h-[var(--row-height)] bg-white z-10">
        {columns.map((column) => {
          let { x, height, columnId, id, width, y } = column;
          return (
            <div
              key={columnId}
              className={classNames(
                "absolute flex justify-center items-center border-t border-r border-b border-gray",
                {
                  "bg-light-blue font-medium": id === selectedId,
                }
              )}
              style={{ width, height, left: x, top: y }}
              onClick={() => onClick(id)}
            >
              <span
                className={classNames(
                  "text-xs",
                  id === selectedId
                    ? "text-black font-medium"
                    : "text-light-gray"
                )}
              >
                {id}
              </span>
              <div
                className="absolute top-0 -right-3 w-6 h-full bg-transparent"
                onMouseEnter={() => handleMouseEnter(column)}
              ></div>
            </div>
          );
        })}
      </div>
      {selectedColumn && (
        <Fragment>
          <div
            ref={resizeRef}
            className="absolute flex gap-[5px] items-center cursor-col-resize z-30"
            style={{
              left: selectedColumn.x + selectedColumn.width - 6,
              top: 0,
              height: selectedColumn.height,
            }}
            onPointerDown={handlePointerDown}
          >
            <div
              className="bg-black rounded-md w-[3px]"
              style={{ height: selectedColumn.height - 8 }}
            ></div>
            <div
              className="bg-black rounded-md w-[3px]"
              style={{ height: selectedColumn.height - 8 }}
            ></div>
          </div>
          {showLine && (
            <div
              className="absolute w-[3px] h-full bg-slate-400 z-30"
              style={{
                left: selectedColumn.x + selectedColumn.width - 2,
                top: 0,
              }}
            ></div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default GridColumns;