import {
  useEffect,
  useMemo,
  useRef,
  useState,
  WheelEvent,
  MouseEvent,
} from "react";
import ActiveCell from "./ActiveCell";
import { convertIntegerToColumnId } from "@/utils";

import {
  ICell,
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

  let [cells, setCells] = useState<Record<string, ICell>>({});

  let [selectedCellId, setSelectedCellId] = useState<string>("");

  let gridRef = useRef<HTMLDivElement>(null);

  let canvasRef = useRef<HTMLCanvasElement>(null);

  const handleResize = () => {
    if (!gridRef.current || !canvasRef.current) return;
    let { clientWidth, clientHeight } = gridRef.current;

    let canvas = canvasRef.current;
    canvas.width = clientWidth;
    canvas.height = clientHeight;

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

  const paintRow = (
    ctx: CanvasRenderingContext2D,
    { height, id, rowId, width, x, y }: IRow
  ) => {
    ctx.save();

    ctx.clearRect(x, y, width, height);

    ctx.beginPath();
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.strokeStyle = "#D5D5D5";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "12px Open-Sans";
    ctx.fillStyle = "#575a5a";
    ctx.fillText(id, x + width / 2, y + height / 2);

    ctx.restore();
  };

  const paintColumn = (
    ctx: CanvasRenderingContext2D,
    { columnId, height, id, width, x, y }: IColumn
  ) => {
    ctx.save();

    ctx.clearRect(x, y, width, height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.strokeStyle = "#D5D5D5";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "12px Open-Sans";
    ctx.fillStyle = "#575a5a";
    ctx.fillText(id, x + width / 2, y + height / 2);

    ctx.restore();
  };

  const paintCell = (
    ctx: CanvasRenderingContext2D,
    { id, rowId, columnId, height, width, x, y }: ICell
  ) => {
    let { backgroundColor, color, content } = sheetDetail.cells[id] ?? {};

    ctx.save();

    ctx.clearRect(x, y, width, height);

    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y);
    ctx.strokeStyle = "#D5D5D5";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.fillRect(x, y, width, height);
      ctx.fill();
    }

    ctx.restore();
  };

  const paintTopLeftBox = (ctx: CanvasRenderingContext2D) => {
    ctx.save();

    ctx.clearRect(0, 0, colWidth, rowHeight);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#D5D5D5";
    ctx.strokeRect(0, 0, colWidth, rowHeight);

    ctx.restore();
  };

  const renderGrid: IRenderGrid = ({
    offsetX,
    offsetY,
    rowStart,
    colStart,
  }) => {
    if (!canvasRef.current) return;

    let {
      meta: { totalRows, totalColumns },
    } = sheetDetail;

    let canvas = canvasRef.current;

    let { clientWidth, clientHeight } = canvas;

    let ctx = canvas.getContext("2d")!;

    let rowData: IRow[] = [];
    let columnData: IColumn[] = [];
    let cellData: Record<string, ICell> = {};

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
          id: convertIntegerToColumnId(i),
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

        cellData[cellId] = {
          id: cellId,
          x,
          y,
          rowId,
          columnId,
          width,
          height,
        };

        paintCell(ctx, cellData[cellId]);
      }
    }

    for (let row of rowData) {
      paintRow(ctx, row);
    }

    for (let column of columnData) {
      paintColumn(ctx, column);
    }

    setRows(rowData);
    setColumns(columnData);
    setCells(cellData);
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;

    let x = event.pageX;
    let y = event.pageY - gridRef.current.getBoundingClientRect().top;

    let cellId = getCellIdByCoordiantes(x, y);

    if (!cellId) return;

    setSelectedCellId(cellId);
  };

  const getCellIdByCoordiantes = (x: number, y: number) => {
    let left = 0;
    let right = rows.length - 1;
    let rowId = null;

    while (left < right) {
      let mid = Math.floor((left + right) / 2);

      if (rows[mid].y <= y) {
        left = mid + 1;
        rowId = rows[mid].id;
      } else {
        right = mid;
      }
    }

    if (!rowId) return null;

    left = 0;
    right = columns.length - 1;
    let columnId = null;

    while (left < right) {
      let mid = Math.floor((left + right) / 2);

      if (columns[mid].x <= x) {
        left = mid + 1;
        columnId = columns[mid].id;
      } else {
        right = mid;
      }
    }

    if (!columnId) return null;

    return columnId + rowId;
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

    if (deltaX === 0) handleVerticalScroll(deltaY);
    else handleHorizontalScroll(deltaX);
  };

  let selectedCell = useMemo(() => {
    return cells[selectedCellId];
  }, [rows, columns, selectedCellId]);

  return (
    <div
      ref={gridRef}
      className="relative h-[var(--grid-height)] overflow-hidden select-none"
      onClick={handleClick}
      onWheel={handleScroll}
    >
      <div className="absolute left-0 top-0 w-[var(--col-width)] h-[var(--row-height)] border border-light-gray bg-white z-10 after:absolute after:right-0 after:h-full after:w-2 after:bg-dark-silver before:absolute before:bottom-0 before:w-full before:h-1 before:bg-dark-silver"></div>
      <canvas ref={canvasRef} className="relative"></canvas>
      {selectedCell && (
        <ActiveCell
          cell={selectedCell}
          data={sheetDetail.cells[selectedCell.id]}
        />
      )}
    </div>
  );
};

export default Grid;
