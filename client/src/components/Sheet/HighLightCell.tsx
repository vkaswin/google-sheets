import { useRef, useEffect } from "react";
import useSheet from "@/hooks/useSheet";

const HighlightCell = () => {
  const { editCell, selectedCell, config, setEditCell } = useSheet();

  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gridRef.current = document.getElementById("grid") as HTMLDivElement;
  }, []);

  const handleDoubleClickCell = () => {
    if (!gridRef.current || !selectedCell) return;

    let { columnId, cellId, width, height, rowId, x, y } = selectedCell;

    let { top } = gridRef.current.getBoundingClientRect();

    setEditCell({
      cellId,
      columnId,
      width,
      height,
      rowId,
      x: Math.max(config.colWidth, x),
      y: Math.max(config.rowHeight + top, y + top),
    });
  };

  if (!selectedCell || editCell) return;

  let { columnId, height, cellId, rowId, width, x, y } = selectedCell;

  let left = `calc(${x}px - var(--col-width))`;
  let top = `calc(${y}px - var(--row-height))`;

  return (
    <div
      className="absolute flex text-sm bg-transparent border-2 border-blue p-1 z-10"
      style={{
        left,
        top,
        width: width,
        height: height,
      }}
      onDoubleClick={handleDoubleClickCell}
    ></div>
  );
};

export default HighlightCell;
