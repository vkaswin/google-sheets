import { Fragment, PointerEvent, useRef, useState } from "react";

import { IRow } from "@/types/Sheets";

type IRowResizer = {
  rows: IRow[];
  onClick: (columnId: number) => void;
  onResize: (columnId: number, value: number) => void;
};

const RowResizer = ({ rows, onClick, onResize }: IRowResizer) => {
  const [selectedRow, setSelectedRow] = useState<IRow | null>(null);

  const [showLine, setShowLine] = useState(false);

  const resizeRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<number | null>(null);

  const handlePointerDown = (event: PointerEvent) => {
    if (!resizeRef.current || !selectedRow) return;

    pointerRef.current = event.pageY;
    resizeRef.current.setPointerCapture(event.pointerId);
    resizeRef.current.addEventListener("pointermove", handlePointerMove);
    resizeRef.current.addEventListener("pointerup", handlePointerUp, {
      once: true,
    });
    setShowLine(true);
  };

  const handlePointerMove = (event: any) => {
    if (!resizeRef.current || !pointerRef.current || !selectedRow) return;
    let { pageY } = event as PointerEvent;
    let height = selectedRow.height + -(pointerRef.current - pageY);
    if (height <= 25) return;
    setSelectedRow({ ...selectedRow, height });
  };

  const handlePointerUp = (event: any) => {
    if (!resizeRef.current || !selectedRow || !pointerRef.current) return;

    let { pageY } = event as PointerEvent;
    resizeRef.current.removeEventListener("pointermove", handlePointerMove);

    let height = selectedRow.height + -(pointerRef.current - pageY);
    onResize(selectedRow.rowId, Math.max(25, height));
    pointerRef.current = null;
    setSelectedRow(null);
    setShowLine(false);
  };

  const handleMouseEnter = (row: IRow) => {
    setSelectedRow({ ...row });
  };

  return (
    <Fragment>
      <div className="absolute left-0 top-0 w-[var(--col-width)] h-full">
        {rows.map((row) => {
          let { x, height, rowId, width, y } = row;
          return (
            <div
              key={rowId}
              className="absolute"
              style={{ width, height, left: x, top: y }}
              onClick={() => onClick(rowId)}
            >
              <div
                className="absolute left-0 -bottom-3 w-full h-6 bg-transparent z-10"
                onMouseEnter={() => handleMouseEnter(row)}
              ></div>
            </div>
          );
        })}
      </div>
      {selectedRow && (
        <Fragment>
          <div
            ref={resizeRef}
            className="absolute flex flex-col items-center gap-[5px] cursor-row-resize z-10"
            style={{
              left: 0,
              top: selectedRow.y + selectedRow.height - 6,
              width: selectedRow.width,
            }}
            onPointerDown={handlePointerDown}
          >
            <div
              className="bg-black rounded-md h-[3px]"
              style={{ width: selectedRow.width / 2 }}
            ></div>
            <div
              className="bg-black rounded-md h-[3px]"
              style={{ width: selectedRow.width / 2 }}
            ></div>
          </div>
          {showLine && (
            <div
              className="absolute h-[3px] w-full bg-slate-400 z-10"
              style={{
                left: 0,
                top: selectedRow.y + selectedRow.height - 2,
              }}
            ></div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default RowResizer;
