import { Fragment, PointerEvent, useRef, useState, MouseEvent } from "react";

type IRowResizerProps = {
  rows: IRow[];
  onClick: (rowId: number) => void;
  onResize: (rowId: number, height: number) => void;
};

const RowResizer = ({ rows, onClick, onResize }: IRowResizerProps) => {
  const [selectedRow, setSelectedRow] = useState<IRow | null>(null);

  const [showLine, setShowLine] = useState(false);

  const resizeRef = useRef<HTMLDivElement>(null);

  const pointerRef = useRef<number | null>(null);

  const columnRef = useRef<HTMLDivElement>(null);

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

  const findRowByYAxis = (y: number) => {
    let left = 0;
    let right = rows.length - 1;
    let rowId: number | null = null;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (rows[mid].y <= y) {
        left = mid + 1;
        rowId = mid;
      } else {
        right = mid - 1;
      }
    }

    if (rowId === null) return null;

    return rowId;
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!columnRef.current || showLine) return;
    let { top } = columnRef.current.getBoundingClientRect();
    let rowId = findRowByYAxis(event.pageY - top);
    if (rowId === null || selectedRow?.rowId === rowId) return;
    setSelectedRow({ ...rows[rowId] });
  };

  const handleMouseLeave = () => {
    setSelectedRow(null);
  };

  const handleClick = () => {
    if (!selectedRow) return;
    onClick(selectedRow.rowId);
  };

  return (
    <Fragment>
      <div
        ref={columnRef}
        className="absolute left-0 top-0 w-[var(--col-width)] h-full z-20"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {selectedRow && (
          <div
            className="absolute"
            style={{
              width: selectedRow.width,
              height: selectedRow.height,
              left: selectedRow.x,
              top: selectedRow.y,
            }}
            onClick={handleClick}
            onContextMenu={handleClick}
          >
            <div
              ref={resizeRef}
              className="absolute left-0 -bottom-[5px] flex flex-col items-center gap-[5px] w-full cursor-row-resize"
              onPointerDown={handlePointerDown}
            >
              <div className="bg-black rounded-md h-[3px] w-3/5"></div>
              <div className="bg-black rounded-md h-[3px] w-3/5"></div>
            </div>
          </div>
        )}
      </div>
      {selectedRow && showLine && (
        <div
          className="absolute h-[3px] w-full bg-slate-400 z-10"
          style={{
            left: 0,
            top: selectedRow.y + selectedRow.height - 2,
          }}
        ></div>
      )}
    </Fragment>
  );
};

export default RowResizer;
