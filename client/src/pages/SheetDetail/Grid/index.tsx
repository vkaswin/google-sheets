import {
  useEffect,
  useMemo,
  useRef,
  useState,
  WheelEvent,
  MouseEvent,
  Fragment,
} from "react";
import HighlightCell from "./HighlightCell";
import EditCell from "./EditCell";
import ColumnResizer from "./ColumnResizer";
import RowResizer from "./RowResizer";

import { convertToTitle } from "@/utils";
import { data } from "../data";

import {
  ICell,
  IColumn,
  IRow,
  IRenderGrid,
  IColumnDetails,
  IRowDetails,
  ICellDetails,
  IRect,
} from "@/types/Sheets";

const colWidth = 46;
const rowHeight = 25;

const cell = {
  width: 100,
  height: 25,
};

const Grid = () => {
  const [rows, setRows] = useState<IRow[]>([]);

  const [columns, setColumns] = useState<IColumn[]>([]);

  const [cells, setCells] = useState<ICell[]>([]);

  const [selectedCellId, setSelectedCellId] = useState<string>("");

  const [editCell, setEditCell] = useState<ICell | null>(null);

  const [refresh, forceUpdate] = useState(0);

  const { current: rowDetails } = useRef<IRowDetails>({});

  const { current: columnDetails } = useRef<IColumnDetails>({});

  const { current: cellDetails } = useRef<ICellDetails>({});

  const gridRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedGrid = useMemo(() => {
    let cell = cells.find(({ cellId }) => cellId === selectedCellId) as ICell;

    if (!cell) return null;

    let [columnId, rowId] = selectedCellId.split(",");

    let row = rows.find((row) => row.rowId === +rowId) as IRow;

    let column = columns.find(
      (column) => column.columnId === +columnId
    ) as IColumn;

    return {
      column,
      row,
      cell,
    };
  }, [rows, columns, selectedCellId]);

  useEffect(() => {
    if (!gridRef.current || !canvasRef.current) return;

    let canvas = canvasRef.current;

    let { clientWidth, clientHeight } = gridRef.current;

    canvas.width = clientWidth;
    canvas.height = clientHeight;

    let { rows, cells, columns } = data;

    for (let row of rows) {
      rowDetails[row.rowId] = row;
    }

    for (let column of columns) {
      columnDetails[column.columnId] = column;
    }

    for (let cell of cells) {
      let id = `${cell.columnId},${cell.rowId}`;
      cellDetails[id] = cell;
    }
  }, []);

  useEffect(() => {
    handleResizeGrid();
  }, [refresh]);

  useEffect(() => {
    window.addEventListener("resize", handleResizeGrid);

    return () => {
      window.removeEventListener("resize", handleResizeGrid);
    };
  }, [rows, columns]);

  const handleResizeGrid = () => {
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

  const paintRow = (
    ctx: CanvasRenderingContext2D,
    { height, rowId, width, x, y }: IRow
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
    ctx.fillText(rowId.toString(), x + width / 2, y + height / 2);
    ctx.restore();
  };

  const paintColumn = (
    ctx: CanvasRenderingContext2D,
    { columnId, height, width, x, y }: IColumn
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
    ctx.fillText(convertToTitle(columnId), x + width / 2, y + height / 2);
    ctx.restore();
  };

  const paintCellRect = (
    ctx: CanvasRenderingContext2D,
    backgroundColor: string,
    { x, y, height, width }: IRect
  ) => {
    ctx.save();
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.fillRect(x, y, width, height);
    ctx.fill();
    ctx.restore();
  };

  const paintCellLine = (
    ctx: CanvasRenderingContext2D,
    { height, width, x, y }: IRect
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y);
    ctx.strokeStyle = "#D5D5D5";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  const paintCell = (
    ctx: CanvasRenderingContext2D,
    { cellId, rowId, columnId, height, width, x, y }: ICell
  ) => {
    let {
      backgroundColor = "#FFFFFF",
      color = "#000000",
      content = "",
    } = cellDetails[cellId] ?? {};

    let rect = { x, y, width, height };

    ctx.clearRect(x, y, width, height);

    paintCellRect(ctx, backgroundColor, rect);
    paintCellLine(ctx, rect);
  };

  const renderGrid: IRenderGrid = ({
    offsetX,
    offsetY,
    rowStart,
    colStart,
  }) => {
    if (!gridRef.current || !canvasRef.current) return;

    let ctx = canvasRef.current.getContext("2d")!;
    let { clientWidth, clientHeight } = gridRef.current;

    let rowData: IRow[] = [];
    let columnData: IColumn[] = [];
    let cellData: ICell[] = [];

    for (let i = rowStart, y = offsetY; y < clientHeight; i++) {
      let height = rowDetails[i]?.height || cell.height;

      if (y + height > rowHeight) {
        rowData.push({
          y,
          x: 0,
          rowId: i,
          height: height,
          width: colWidth,
        });
      }

      y += height;
    }

    for (let i = colStart, x = offsetX; x < clientWidth; i++) {
      let width = columnDetails[i]?.width || cell.width;

      if (x + width > colWidth) {
        columnData.push({
          x,
          y: 0,
          columnId: i,
          width,
          height: rowHeight,
        });
      }

      x += width;
    }

    for (let { rowId, height, y } of rowData) {
      for (let { width, x, columnId } of columnData) {
        let cellId = `${columnId},${rowId}`;

        cellData.push({
          x,
          y,
          rowId,
          columnId,
          width,
          height,
          cellId,
        });

        paintCell(ctx, cellData.at(-1)!);
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

  const handleClickGrid = (event: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;

    let x = event.pageX;
    let y = event.pageY - gridRef.current.getBoundingClientRect().top;

    let cellId = getCellIdByCoordiantes(x, y);

    if (!cellId) return;

    setSelectedCellId(cellId);
    setEditCell(null);
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

  const handleVerticalScroll = (deltaY: number) => {
    if (!rows.length || !columns.length) return;

    let { rowId, y } = rows[0];
    let { columnId, x } = columns[0];

    if (deltaY < 0) {
      // Scroll upwards
      y += -deltaY;
      rowId--;

      while (rowId > 0 && y > rowHeight) {
        y -= rowDetails[rowId]?.height ?? cell.height;
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
        x -= columnDetails[columnId]?.width ?? cell.width;
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

  const handleDoubleClickCell = () => {
    if (!gridRef.current || !selectedGrid) return;

    let { columnId, cellId, width, height, rowId, x, y } = selectedGrid.cell;

    let { top } = gridRef.current.getBoundingClientRect();

    setEditCell({
      cellId,
      columnId,
      width,
      height,
      rowId,
      x: Math.max(colWidth, x),
      y: Math.max(rowHeight + top, y + top),
    });
  };

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleClickGrid(event);
  };

  const handleClickColumn = (columnId: number) => {
    console.log(columnId);
  };

  const handleClickRow = (rowId: number) => {
    console.log(rowId);
  };

  const handleResizeColumn = (columnId: number, value: number) => {
    if (!columnDetails[columnId])
      columnDetails[columnId] = { columnId, width: value };
    else columnDetails[columnId].width = value;

    forceUpdate(Math.random());
  };

  const handleResizeRow = (rowId: number, value: number) => {
    if (!rowDetails[rowId]) rowDetails[rowId] = { rowId, height: value };
    else rowDetails[rowId].height = value;

    forceUpdate(Math.random());
  };

  return (
    <Fragment>
      <div
        ref={gridRef}
        className="relative h-[var(--grid-height)] select-none overflow-hidden"
        onClick={handleClickGrid}
        onContextMenu={handleContextMenu}
        onWheel={handleScroll}
      >
        <canvas ref={canvasRef} className="relative"></canvas>
        <div className="absolute left-0 top-0 w-[var(--col-width)] h-[var(--row-height)] border border-light-gray bg-white z-20 after:absolute after:right-0 after:h-full after:w-1 after:bg-dark-silver before:absolute before:bottom-0 before:w-full before:h-1 before:bg-dark-silver"></div>
        <ColumnResizer
          columns={columns}
          onClick={handleClickColumn}
          onResize={handleResizeColumn}
        />
        <RowResizer
          rows={rows}
          onClick={handleClickRow}
          onResize={handleResizeRow}
        />
        {!editCell && selectedGrid && (
          <HighlightCell
            selectedGrid={selectedGrid}
            onDoubleClick={handleDoubleClickCell}
          />
        )}
      </div>
      {editCell && (
        <EditCell
          cell={editCell}
          data={cellDetails[editCell.cellId]}
          onWheel={handleScroll}
        />
      )}
    </Fragment>
  );
};

export default Grid;
