import { WheelEvent, useEffect, useRef, useState } from "react";
import GridColumns from "./GridColumns";
import GridRows from "./GridRows";
import GridCells from "./GridCells";
import ActiveCell from "./ActiveCell";

import {
  ICell,
  IClickCell,
  IColumn,
  IRow,
  ISheetDetail,
  IRenderGrid,
} from "@/types/Sheets";

type IGridProps = {
  sheetDetail: ISheetDetail;
};

let colWidth = 46;
let rowHeight = 25;

let cell = {
  width: 100,
  height: 25,
};

const Grid = ({ sheetDetail }: IGridProps) => {
  let [rows, setRows] = useState<IRow[]>([]);

  let [columns, setColumns] = useState<IColumn[]>([]);

  let [cells, setCells] = useState<Map<string, ICell>>(new Map());

  let [selectedCell, setSelectedCell] = useState<ICell | null>(null);

  let gridRef = useRef<HTMLDivElement>(null);

  let canvasRef = useRef<HTMLCanvasElement>(null);

  const handleResize = () => {
    let { rowId = 1, y = rowHeight } = rows[0] ?? {};
    let { columnId = 1, x = colWidth } = columns[0] ?? {};

    renderGrid({
      offsetX: x,
      offsetY: y,
      rowStart: rowId,
      colStart: columnId,
    });
  };

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [rows, columns]);

  const renderGrid: IRenderGrid = ({
    offsetX,
    offsetY,
    rowStart,
    colStart,
  }) => {
    if (!gridRef.current) return;

    let { totalRows, totalColumns } = sheetDetail.meta;

    let { clientWidth, clientHeight } = gridRef.current;

    let rowData: IRow[] = [];
    let columnData: IColumn[] = [];
    let cellData = new Map<string, ICell>();

    for (
      let i = rowStart, y = offsetY;
      i <= totalRows && y < clientHeight;
      i++
    ) {
      let height = sheetDetail.rows[i]?.height || cell.height;

      if (y + height > rowHeight) {
        rowData.push({
          y,
          x: 0,
          id: `${i}`,
          rowId: i,
          height: height,
          width: colWidth,
        });
      }

      y += height;
    }

    for (
      let i = colStart, x = offsetX;
      i <= totalColumns && x < clientWidth;
      i++
    ) {
      let width = sheetDetail.columns[i]?.width || cell.width;

      if (x + width > colWidth) {
        columnData.push({
          x,
          y: 0,
          id: String.fromCharCode(96 + i).toUpperCase(),
          columnId: i,
          width,
          height: rowHeight,
        });
      }

      x += width;
    }

    for (let { id: rowId, height, y } of rowData) {
      for (let { id: columnId, width, x } of columnData) {
        let cellId = `${columnId}${rowId}`;

        cellData.set(cellId, {
          id: cellId,
          x,
          y,
          rowId,
          columnId,
          width,
          height,
          props: { ...sheetDetail.cells[cellId] },
        });
      }
    }

    setRows(rowData);
    setColumns(columnData);
    setCells(cellData);
  };

  const handleClickCell: IClickCell = (cell) => {
    setSelectedCell(cell);
  };

  const handleVerticalScroll = (deltaY: number) => {
    if (!rows.length || !columns.length) return;

    let { rowId, y } = rows[0];
    let { columnId, x } = columns[0];

    if (deltaY < 0) {
      // Scroll upwards
      y += -deltaY;
      rowId--;

      while (rowId > 0 && y > rowHeight) {
        y -= sheetDetail.rows[rowId]?.height ?? cell.height;
        rowId--;
      }

      renderGrid({
        offsetX: x,
        offsetY: Math.min(rowHeight, y),
        rowStart: rowId + 1,
        colStart: columnId,
      });
    } else {
      // Scroll downwards
      renderGrid({
        offsetX: x,
        offsetY: y + -deltaY,
        rowStart: rowId,
        colStart: columnId,
      });
    }
  };

  const handleHorizontalScroll = (deltaX: number) => {
    if (!rows.length || !columns.length) return;

    let { rowId, y } = rows[0];
    let { columnId, x } = columns[0];

    if (deltaX < 0) {
      // Scroll leftwards
      x += -deltaX;
      columnId--;

      while (columnId > 0 && x > colWidth) {
        x -= sheetDetail.columns[columnId]?.width ?? cell.width;
        columnId--;
      }

      renderGrid({
        offsetX: Math.min(colWidth, x),
        offsetY: y,
        rowStart: rowId,
        colStart: columnId + 1,
      });
    } else {
      // Scroll rightwards
      renderGrid({
        offsetX: x + -deltaX,
        offsetY: y,
        rowStart: rowId,
        colStart: columnId,
      });
    }
  };

  const handleScroll = (event: WheelEvent<HTMLDivElement>) => {
    let { deltaX, deltaY } = event;

    if (deltaX === -0) handleVerticalScroll(deltaY);
    else handleHorizontalScroll(deltaX);
  };

  return (
    <div
      ref={gridRef}
      className="relative h-[var(--grid-height)] overflow-hidden select-none"
      onWheel={handleScroll}
    >
      <div
        className="absolute top-0 left-0 border bg-white border-gray after:absolute after:w-full after:bg-dark-silver after:h-1 after:-bottom-[1px] after:left-0 before:absolute before:w-1 before:bg-dark-silver before:h-full before:-right-[1px] before:top-0 z-20"
        style={{ width: colWidth, height: rowHeight }}
      ></div>
      <GridColumns
        columns={columns}
        selectedColumnId={selectedCell?.columnId}
      />
      <GridRows rows={rows} selectedRowId={selectedCell?.rowId} />
      <GridCells cells={cells} onClickCell={handleClickCell} />
      <canvas ref={canvasRef}></canvas>
      {selectedCell && <ActiveCell cell={selectedCell} />}
    </div>
  );
};

export default Grid;
