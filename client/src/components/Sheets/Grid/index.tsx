import { useEffect, useRef, WheelEvent, MouseEvent, useState } from "react";
import { sheetData } from "./data";
import { throttle } from "@/utils";
import {
  IRenderGridColumn,
  IScrollPosition,
  IRenderGridRow,
  IRenderGridCell,
  ICellRect,
  IGridCellStyle,
  IGridLineStyle,
  IRenderGridCellLine,
  IRenderGrid,
  ICellList,
  IRowList,
  IColumnList,
} from "@/types/Sheets";

import styles from "./Grid.module.scss";

let cell = {
  width: 100,
  height: 25,
};

let scrollBy = 3;

const Grid = () => {
  let gridRef = useRef<HTMLDivElement | null>(null);
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  let ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  let cellList = useRef<ICellList>([]);
  let rowList = useRef<IRowList>([]);
  let columnList = useRef<IColumnList>([]);

  useEffect(() => {
    initCanvas();

    if (!ctxRef.current) return;

    renderGrid({
      offsetX: 0,
      offsetY: cell.height,
      rowStart: 1,
      colStart: 1,
    });
  }, []);

  let renderBox = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, cell.width / 2, cell.height);
    setGridLineStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(0, cell.height);
    ctx.lineTo(cell.width / 2, cell.height);
    ctx.lineTo(cell.width / 2, 1);
    ctx.lineTo(0, 1);
    ctx.stroke();
    unsetGridLineStyle(ctx);
  };

  let initCanvas = () => {
    if (!gridRef.current || !canvasRef.current) return;

    let { clientWidth, clientHeight } = gridRef.current;
    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctxRef.current = ctx;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
  };

  let renderGridColumn: IRenderGridColumn = (ctx, { x, width, id }) => {
    setGridLineStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(x, 1);
    ctx.lineTo(x + width, 1);
    ctx.lineTo(x + width, cell.height);
    ctx.lineTo(x, cell.height);
    ctx.fillText(id, x + width / 2, cell.height / 2);
    ctx.stroke();
    unsetGridLineStyle(ctx);
  };

  let renderGridRow: IRenderGridRow = (ctx, { x, y, height, id }) => {
    setGridLineStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(cell.width / 2, y + height);
    ctx.fillText(id, cell.width / 4, y + height / 2);
    ctx.stroke();
    unsetGridLineStyle(ctx);
  };

  let unsetGridCellStyle: IGridCellStyle = (ctx) => {
    ctx.fillStyle = "#000000";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  };

  let setGridLineStyle: IGridLineStyle = (ctx) => {
    ctx.strokeStyle = "silver";
    ctx.fillStyle = "#566164";
    ctx.font = "14px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  };

  let unsetGridLineStyle: IGridLineStyle = (ctx) => {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  };

  let renderGridCellLine: IRenderGridCellLine = (
    ctx,
    { x, y, width, height }
  ) => {
    setGridLineStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.stroke();
    unsetGridLineStyle(ctx);
  };

  let renderGridCell: IRenderGridCell = (ctx, rect, props) => {
    renderGridCellLine(ctx, rect);

    if (!props) return;

    let { x, y, width, height } = rect;
    let { text, color, backgroundColor } = props;

    ctx.font = "14px Poppins";
    ctx.textBaseline = "middle";

    if (backgroundColor) {
      ctx.beginPath();
      ctx.fillStyle = backgroundColor || "#000000";
      ctx.fillRect(x, y, width, height);
      ctx.fill();
    }

    if (text) {
      ctx.beginPath();
      ctx.fillStyle = color || "#000000";
      ctx.fillText(text, x + 5, y + height - 10);
      ctx.fill();
    }

    unsetGridCellStyle(ctx);
  };

  let renderGrid: IRenderGrid = ({ offsetY, colStart, rowStart }) => {
    let ctx = ctxRef.current;

    if (!ctx) return;

    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    let y = offsetY;

    cellList.current = [];
    rowList.current = [];
    columnList.current = [];
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    let {
      meta: { columnIds, totalRows },
      rows,
      columns,
      cells,
    } = sheetData;

    let isColumnRendered = false;

    for (let row = rowStart; row <= totalRows && y < canvasHeight; row++) {
      let rowId = row.toString();
      let height = rows[rowId]?.height || cell.height;
      let x = cell.width / 2;
      let rowInfo = {
        x: 0,
        y,
        height,
        id: rowId,
      };

      renderGridRow(ctx, rowInfo);
      rowList.current.push(rowInfo);

      for (
        let column = colStart;
        column <= columnIds.length && x < canvasWidth;
        column++
      ) {
        let columnId = columnIds[column - 1];
        let cellId = `${columnId}${rowId}`;
        let width = columns[columnId]?.width || cell.width;
        let props = cells[cellId];
        let rect: ICellRect = {
          x,
          y,
          width,
          height,
          id: cellId,
        };

        cellList.current.push(rect);

        renderGridCell(ctx, rect, props);

        if (!isColumnRendered) {
          renderGridColumn(ctx, { x, width, id: columnId });
          columnList.current.push({ x, width, id: column.toString(), y: 0 });
        }

        x += width;
      }

      y += height;
      isColumnRendered = true;
    }

    renderBox(ctx);
  };

  const handleScroll = (event: WheelEvent) => {
    let ctx = ctxRef.current;

    if (!ctx) return;

    let { deltaY, deltaX } = event;

    let key: keyof IScrollPosition = deltaY === -0 ? "left" : "top";

    let rowStart = +rowList.current[0].id;
    let colStart = +columnList.current[0].id;

    if (key === "top") {
      rowStart = Math.max(
        1,
        deltaY > 0 ? rowStart + scrollBy : rowStart - scrollBy
      );
    } else {
      colStart = Math.max(
        1,
        deltaX > 0 ? colStart + scrollBy : colStart - scrollBy
      );
    }

    renderGrid({
      rowStart,
      colStart,
      offsetX: 0,
      offsetY: cell.height,
    });
  };

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  return (
    <div
      ref={gridRef}
      className={styles.container}
      onContextMenu={handleContextMenu}
      onWheel={throttle(handleScroll, 50)}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Grid;
