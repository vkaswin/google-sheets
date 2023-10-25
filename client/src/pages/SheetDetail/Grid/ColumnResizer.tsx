import { Fragment, PointerEvent, useRef, useState } from "react";

import { IColumn } from "@/types/Sheets";

type IColumnResizer = {
  columns: IColumn[];
  onClick: (columnId: string) => void;
  onResize: (columnId: string, value: number) => void;
};

const ColumnResizer = ({ columns, onClick, onResize }: IColumnResizer) => {
  const [selectedColumnId, setSelectedColumnId] = useState("");

  const [showLine, setShowLine] = useState(false);

  const pointer = useRef(0);
  const resizeRef = useRef<HTMLDivElement>();

  const handlePointerDown = (event: PointerEvent) => {
    if (!resizeRef.current) return;

    pointer.current = event.pageX;
    resizeRef.current.setPointerCapture(event.pointerId);
    resizeRef.current.addEventListener("pointermove", handlePointerMove);
    resizeRef.current.addEventListener("pointerup", handlePointerUp, {
      once: true,
    });
    setShowLine(true);
  };

  const handlePointerMove = (event: any) => {
    if (!resizeRef.current) return;
    let { pageX } = event as PointerEvent;
    resizeRef.current.style.right = `${Math.min(
      50,
      -5 + (pointer.current - pageX)
    )}px`;
  };

  const handlePointerUp = (event: any) => {
    if (!resizeRef.current) return;
    let { pageX } = event as PointerEvent;
    resizeRef.current.removeEventListener("pointermove", handlePointerMove);
    setShowLine(false);
    onResize(selectedColumnId, -(pointer.current - pageX));
    pointer.current = 0;
  };

  const handleMouseEnter = (columnId: string) => {
    setSelectedColumnId(columnId);
  };

  const handleResizeRef = (ref: HTMLDivElement | null) => {
    if (!ref) return;
    resizeRef.current = ref;
  };

  return (
    <Fragment>
      <div className="absolute left-0 top-0">
        {columns.map(({ x, height, columnId, id, width, y }) => {
          return (
            <div
              key={columnId}
              className="absolute"
              style={{ width, height, left: x, top: y }}
              onMouseEnter={() => handleMouseEnter(id)}
              onClick={() => onClick(id)}
            >
              {id === selectedColumnId && (
                <div
                  className="group absolute flex gap-[5px] items-center h-full cursor-col-resize"
                  style={{ right: -5 }}
                  onPointerDown={handlePointerDown}
                  ref={handleResizeRef}
                >
                  {showLine && (
                    <div
                      className="absolute w-1 top-0 right-1 bg-slate-400"
                      style={{ height: "400px" }}
                    ></div>
                  )}
                  <div className="h-3/5 bg-black rounded-md w-[3px] transition-opacity opacity-0 group-hover:opacity-100"></div>
                  <div className="h-3/5 bg-black rounded-md w-[3px] transition-opacity opacity-0 group-hover:opacity-100"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default ColumnResizer;
