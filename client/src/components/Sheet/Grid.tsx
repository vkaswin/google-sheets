import { MouseEvent, ReactNode } from "react";
import useSheet from "@/hooks/useSheet";

type IGridProps = {
  children: ReactNode;
};

const Grid = ({ children }: IGridProps) => {
  const {
    grid: { rows, columns },
    gridRef,
    setGridRef,
    setContextMenuRect,
    setSelectedCellId,
    setEditCell,
    setSelectedColumnId,
    setSelectedRowId,
  } = useSheet();

  const handleClickGrid = (event: MouseEvent<HTMLDivElement>) => {
    if (!gridRef) return;

    let x = event.pageX;
    let y = event.pageY - gridRef.getBoundingClientRect().top;

    let cellId = getCellIdByCoordiantes(x, y);

    if (!cellId) return;

    setSelectedCellId(cellId);
    setEditCell(null);
    setSelectedColumnId(null);
    setSelectedRowId(null);
    setContextMenuRect(null);
  };

  const getCellIdByCoordiantes = (x: number, y: number) => {
    let left = 0;
    let right = rows.length - 1;
    let rowId = null;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);

      if (rows[mid].y <= y) {
        left = mid + 1;
        rowId = rows[mid].rowId;
      } else {
        right = mid - 1;
      }
    }

    if (!rowId) return null;

    left = 0;
    right = columns.length - 1;
    let columnId = null;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);

      if (columns[mid].x <= x) {
        left = mid + 1;
        columnId = columns[mid].columnId;
      } else {
        right = mid - 1;
      }
    }

    if (!columnId) return null;

    return `${columnId},${rowId}`;
  };

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleClickGrid(event);
    setContextMenuRect({ x: event.pageX, y: event.pageY });
  };

  return (
    <div
      ref={setGridRef}
      className="relative w-[var(--grid-width)] h-[var(--grid-height)] select-none overflow-hidden"
      onClick={handleClickGrid}
      onContextMenu={handleContextMenu}
    >
      {children}
    </div>
  );
};

export default Grid;
