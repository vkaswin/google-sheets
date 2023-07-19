import { useEffect, useRef, WheelEvent, MouseEvent, useState } from "react";
import { sheetData } from "./data";
import { throttle } from "@/utils";
import {
  IRenderGridColumn,
  IScrollPosition,
  IRenderGridRow,
  IRenderGridCell,
  IGridCells,
  ICellRect,
  IGridCellStyle,
  IClearCanvas,
  IRenderGridYAxisDownWards,
  IGridLineStyle,
  IRenderGridCellLine,
  IRenderGrid,
} from "@/types/Sheets";

import styles from "./Grid.module.scss";

let cell = {
  width: 100,
  height: 25,
};

const Grid = () => {
  let gridRef = useRef<HTMLDivElement | null>(null);
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  let ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  let virtualCanvasRef = useRef({} as HTMLCanvasElement);
  let virtualCtxRef = useRef({} as CanvasRenderingContext2D);
  let cellsList = useRef<IGridCells>([]);

  let [scroll, setScroll] = useState<IScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    initCanvas();
    if (!ctxRef.current) return;
    renderBox(ctxRef.current);
    renderGrid(ctxRef.current, {
      offsetX: 0,
      offsetY: cell.height,
      rowStart: 0,
      colStart: 0,
    });
  }, []);

  let renderBox = (ctx: CanvasRenderingContext2D) => {
    setGridLineStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(0, cell.height);
    ctx.lineTo(cell.width / 2, cell.height + 1);
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

    let virtualCanvas = document.createElement("canvas");
    virtualCanvas.width = canvas.width;
    virtualCanvas.height = canvas.height;
    virtualCtxRef.current = virtualCanvas.getContext("2d")!;
    virtualCanvasRef.current = virtualCanvas;
  };

  let renderGridColumn: IRenderGridColumn = (
    ctx,
    { x, y, width, columnId }
  ) => {
    setGridLineStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(x, y - cell.height + 1);
    ctx.lineTo(x + width, y - cell.height + 1);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x, y);
    ctx.fillText(columnId, x + width / 2, cell.height / 2);
    ctx.stroke();
    unsetGridLineStyle(ctx);
  };

  let renderGridRow: IRenderGridRow = (ctx, { x, y, height, rowId }) => {
    setGridLineStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(cell.width / 2, y + height);
    ctx.fillText(rowId, cell.width / 4, y + height / 2);
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

  let renderGrid: IRenderGrid = (ctx, { offsetY, colStart, rowStart }) => {
    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    let y = offsetY;

    let {
      meta: { columnIds, totalRows },
      rows,
      columns,
      cells,
    } = sheetData;

    let isColumnRendered = false;

    for (let row = rowStart; row < totalRows && y < canvasHeight; row++) {
      let rowId = (row + 1).toString();
      let height = rows[rowId]?.height || cell.height;
      let cellsRect: ICellRect[] = [];
      let x = cell.width / 2;

      cellsList.current.push([{ rowId, x, y }, cellsRect]);

      renderGridRow(ctx, {
        x: 0,
        y,
        height,
        rowId,
      });

      for (
        let column = colStart;
        column < columnIds.length && x < canvasWidth;
        column++
      ) {
        let columnId = columnIds[column];
        let cellId = `${columnId}${rowId}`;
        let width = columns[columnId]?.width || cell.width;
        let props = cells[cellId];
        let rect: ICellRect = {
          x,
          y,
          width,
          height,
          cellId,
        };

        cellsRect.push(rect);

        if (!isColumnRendered) renderGridColumn(ctx, { x, y, width, columnId });

        renderGridCell(ctx, rect, props);

        x += width;
      }

      y += height;
      isColumnRendered = true;
    }
  };

  let clearCanvas: IClearCanvas = (ctx, virtualCtx) => {
    virtualCtx.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clearRect(0, cell.height, ctx.canvas.width, ctx.canvas.height);
  };

  let renderGridYAxisDownWards: IRenderGridYAxisDownWards = (
    ctx,
    virtualCtx
  ) => {
    clearCanvas(ctx, virtualCtx);

    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;

    //   Draw top cells
    ctx.drawImage(
      virtualCtx.canvas,
      0,
      cell.height * 4,
      canvasWidth,
      canvasHeight,
      0,
      cell.height,
      canvasWidth,
      canvasHeight
    );
  };

  const handleScroll = (event: WheelEvent, key: keyof IScrollPosition) => {
    let ctx = ctxRef.current;
    let virtualCtx = virtualCtxRef.current;

    if (!ctx || !virtualCtx) return;

    let { deltaY } = event;
    let scrollPosition = { ...scroll };

    if (deltaY > 0) {
      scrollPosition[key] += 3 * cell.height;
      key === "x" ? "" : renderGridYAxisDownWards(ctx, virtualCtx);
    } else {
      scrollPosition[key] = Math.max(0, scrollPosition[key] - 3 * cell.height);
    }

    setScroll(scrollPosition);
  };

  let handleVerticalScroll = throttle(
    (event: WheelEvent) => handleScroll(event, "y"),
    500
  );

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  return (
    <div
      ref={gridRef}
      className={styles.container}
      onContextMenu={handleContextMenu}
      onWheel={handleVerticalScroll}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Grid;
