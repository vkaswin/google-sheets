import { Fragment, PointerEvent, useRef, useState, MouseEvent } from "react";

type IColumnResizerProps = {
  columns: IColumn[];
  onClick: (columnId: number) => void;
  onResize: (columnId: number, width: number) => void;
};

const CoumnResizer = ({ columns, onResize, onClick }: IColumnResizerProps) => {
  const [selectedColumn, setSelectedColumn] = useState<IColumn | null>(null);

  const [showLine, setShowLine] = useState(false);

  const [showResizer, setShowResizer] = useState(false);

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
    onResize(selectedColumn.columnId, Math.max(50, width));
    pointerRef.current = null;
    setSelectedColumn(null);
    setShowLine(false);
  };

  const toggleResizer = () => {
    setShowResizer(!showResizer);
  };

  const findColumnByXAxis = (x: number) => {
    let left = 0;
    let right = columns.length - 1;
    let columnId: number | null = null;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (columns[mid].x <= x) {
        left = mid + 1;
        columnId = mid;
      } else {
        right = mid - 1;
      }
    }

    if (columnId === null) return null;

    return columnId;
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (showLine) return;
    let columnId = findColumnByXAxis(event.pageX);
    if (columnId === null || selectedColumn?.columnId === columnId) return;
    setSelectedColumn({ ...columns[columnId] });
  };

  const handleMouseLeave = () => {
    setSelectedColumn(null);
  };

  const handleClick = () => {
    if (!selectedColumn) return;
    onClick(selectedColumn.columnId);
  };

  return (
    <Fragment>
      <div
        className="absolute left-0 top-0 w-full h-[var(--row-height)] z-20"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {selectedColumn && (
          <div
            className="absolute"
            style={{
              width: selectedColumn.width,
              height: selectedColumn.height,
              left: selectedColumn.x,
              top: selectedColumn.y,
            }}
            onClick={handleClick}
            onContextMenu={handleClick}
          >
            <div
              className="absolute top-0 -right-3 w-6 h-full bg-transparent"
              onMouseEnter={toggleResizer}
            ></div>
            <div
              ref={resizeRef}
              className="absolute top-0 -right-[5px] flex gap-[5px] items-center h-full cursor-col-resize"
              onPointerDown={handlePointerDown}
            >
              <div className="bg-black rounded-md w-[3px] h-2/3"></div>
              <div className="bg-black rounded-md w-[3px] h-2/3"></div>
            </div>
          </div>
        )}
      </div>
      {selectedColumn && showLine && (
        <div
          className="absolute w-[3px] h-full bg-slate-400 z-10"
          style={{
            left: selectedColumn.x + selectedColumn.width - 2,
            top: 0,
          }}
        ></div>
      )}
    </Fragment>
  );
};

export default CoumnResizer;
