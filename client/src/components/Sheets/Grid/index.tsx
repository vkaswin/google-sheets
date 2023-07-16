import { useEffect, useRef, WheelEvent, MouseEvent, useState } from "react";
import { sheetData } from "./data";
import { throttle } from "@/utils";
import {
  IGridColumnStyle,
  IGridRowStyle,
  IRenderGridColumn,
  IScrollPosition,
  IRenderGridColumns,
  IRenderGridRow,
  IRenderGridCell,
  IGridCells,
  ICellRect,
  IGridCellStyle,
} from "@/types/Sheets";

import styles from "./Grid.module.scss";

let cell = {
  width: 100,
  height: 25,
};

const Grid = () => {
  let gridRef = useRef<HTMLDivElement | null>(null);
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  let contextRef = useRef<CanvasRenderingContext2D | null>(null);
  let cellsList = useRef<IGridCells>(new Map());

  let [scroll, setScroll] = useState<IScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    renderGrid();
  }, []);

  let setGridColumnStyle: IGridColumnStyle = (ctx) => {
    ctx.strokeStyle = "silver";
    ctx.fillStyle = "#566164";
    ctx.font = "14px Poppins";
    ctx.textBaseline = "middle";
  };

  let unsetGridColumnStyle: IGridColumnStyle = (ctx) => {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.font = "10px sans-serif";
    ctx.textBaseline = "alphabetic";
  };

  let renderGridColumn: IRenderGridColumn = (ctx, { x, y, width, text }) => {
    ctx.beginPath();
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width, ctx.canvas.width);
    if (text) ctx.fillText(text, x + width / 2, cell.height / 2);
    ctx.stroke();
  };

  let renderGridColumns: IRenderGridColumns = (ctx) => {
    let x = 0;
    let y = 0;
    let width = cell.width / 2;
    let canvasWidth = ctx.canvas.width;
    let {
      meta: { columnIds },
      columns,
    } = sheetData;

    setGridColumnStyle(ctx);

    renderGridColumn(ctx, {
      x,
      y,
      width,
    });

    x += width;

    for (let columnId of columnIds) {
      if (x > canvasWidth) break;

      let width = columns[columnId]?.width || cell.width;

      renderGridColumn(ctx, {
        x,
        y,
        width,
        text: columnId,
      });

      x += width;
    }

    unsetGridColumnStyle(ctx);
  };

  let setGridRowStyle: IGridRowStyle = (ctx) => {
    ctx.strokeStyle = "silver";
    ctx.fillStyle = "#566164";
    ctx.font = "14px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  };

  let unsetGridRowStyle: IGridRowStyle = (ctx) => {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  };

  let renderGridRow: IRenderGridRow = (ctx, { x, y, height, text }) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(ctx.canvas.width, y);
    if (text) ctx.fillText(text, cell.width / 4, y + height / 2);
    ctx.stroke();
  };

  let unsetGridCellStyle: IGridCellStyle = (ctx) => {
    ctx.fillStyle = "#000000";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  };

  let renderGridCell: IRenderGridCell = (
    ctx,
    { x, y, width, height },
    { text, color, backgroundColor }
  ) => {
    ctx.font = "14px Poppins";
    ctx.textBaseline = "middle";

    if (backgroundColor) {
      ctx.fillStyle = backgroundColor || "#000000";
      ctx.fillRect(x, y, width, height);
    }

    if (text) {
      ctx.fillStyle = color || "#000000";
      ctx.fillText(text, x + 5, y + height - 10);
    }

    ctx.fill();

    unsetGridCellStyle(ctx);
  };

  let renderGrid = () => {
    if (!gridRef.current || !canvasRef.current) return;

    let { clientWidth, clientHeight } = gridRef.current;
    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    if (!ctx) return;

    contextRef.current = ctx;
    canvas.width = clientWidth;
    canvas.height = clientHeight;

    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    let y = cell.height;

    let {
      meta: { columnIds, totalRows },
      rows,
      columns,
      cells,
    } = sheetData;

    // Draw column lines
    renderGridColumns(ctx);

    // Draw top line
    setGridRowStyle(ctx);
    renderGridRow(ctx, { x: 0, y: 1, height: cell.height });
    unsetGridRowStyle(ctx);

    // Draw row lines and cells
    for (let row = 1; row <= totalRows && y < canvasHeight; row++) {
      let rowId = row.toString();
      let height = rows[row]?.height || cell.height;
      let cellRects = new Map<string, ICellRect>();
      let x = cell.width / 2;
      cellsList.current.set(rowId, cellRects);

      setGridRowStyle(ctx);
      renderGridRow(ctx, {
        x: 0,
        y,
        height,
        text: rowId,
      });
      unsetGridRowStyle(ctx);

      for (
        let column = 0;
        column < columnIds.length && x < canvasWidth;
        column++
      ) {
        let columnId = columnIds[column];
        let cellId = `${columnId}${rowId}`;
        let width = columns[columnId]?.width || cell.width;
        let props = cells[cellId];
        let rect = {
          x,
          y,
          width,
          height,
          cellId,
        };

        cellRects.set(cellId, rect);

        if (props) renderGridCell(ctx, rect, props);

        x += width;
      }

      y += height;
    }
  };

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  const handleScroll = (event: WheelEvent, key: keyof IScrollPosition) => {
    let { deltaY } = event;
    let coordinates = { ...scroll };

    if (deltaY > 0) {
      coordinates[key] += 3 * cell.height;
    } else {
      coordinates[key] = Math.max(0, coordinates[key] - 3 * cell.height);
    }

    setScroll(coordinates);
  };

  let handleScrollY = throttle((e: WheelEvent) => handleScroll(e, "y"), 1000);

  return (
    <div
      ref={gridRef}
      className={styles.container}
      onContextMenu={handleContextMenu}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Grid;
