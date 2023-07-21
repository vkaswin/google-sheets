import {
  useEffect,
  useRef,
  WheelEvent,
  MouseEvent,
  useState,
  useMemo,
  Fragment,
} from "react";
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
  IRowRect,
  IColumnRect,
  ISelectedCell,
  ISelectedRow,
  ISelectedColumn,
  ICloseRightGrid,
  ISheetDetail,
} from "@/types/Sheets";

import styles from "./Grid.module.scss";

let cell = {
  width: 100,
  height: 25,
};

type IGridProps = {
  sheetDetail: ISheetDetail;
};

const Grid = ({
  sheetDetail: {
    meta: { columnIds, totalRows },
    cells,
    columns,
    rows,
  },
}: IGridProps) => {
  let gridRef = useRef<HTMLDivElement | null>(null);
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  let ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  let cellList = useRef<ICellRect[]>([]);
  let rowList = useRef<IRowRect[]>([]);
  let columnList = useRef<IColumnRect[]>([]);
  let isReachedBottom = useRef(false);
  let isReachedRight = useRef(false);

  let [selectedCell, setSelectedCell] = useState<ISelectedCell>();
  let [selectedRow, setSelectedRow] = useState<ISelectedRow>();
  let [selectedColumn, setSelectedColumn] = useState<ISelectedColumn>();

  useEffect(() => {
    initCanvas();

    if (!ctxRef.current) return;

    renderGrid({
      rowStart: 1,
      colStart: 1,
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.addEventListener("resize", handleResize);
    };
  }, []);

  let handleResize = () => {
    if (!gridRef.current || !canvasRef.current) return;

    let { clientWidth, clientHeight } = gridRef.current;

    canvasRef.current.width = clientWidth;
    canvasRef.current.height = clientHeight;

    let rowStart = rowList.current[0]!.id;
    let colStart = columnList.current[0]!.id;

    renderGrid({
      rowStart,
      colStart,
    });
  };

  let renderTopLeftBox = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, cell.width / 2, cell.height);
    setGridLineStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(0, cell.height);
    ctx.lineTo(cell.width / 2, cell.height);
    ctx.lineTo(cell.width / 2, 1);
    ctx.lineTo(0, 1);
    ctx.fillStyle = "#C7C7C7";
    ctx.fillRect(0, cell.height - 5, cell.width / 2, 5);
    ctx.fillRect(cell.width / 2 - 5, 0, 5, cell.height);
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
    ctx.fillText(id.toString(), cell.width / 4, y + height / 2);
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
    let { x, y, width, height } = rect;

    ctx.clearRect(x, y, width, height);

    renderGridCellLine(ctx, rect);

    if (!props) return;

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

  let closeRightGrid: ICloseRightGrid = (ctx, { x, y }) => {
    setGridLineStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.stroke();
    unsetGridCellStyle(ctx);
    isReachedRight.current = true;
  };

  let handleUpdateSelectedOne = () => {
    if (selectedCell) {
      let cell = cellList.current.find(({ id }) => id === selectedCell!.id);
      if (cell) setSelectedCell({ ...cell, hidden: false });
      else setSelectedCell({ ...selectedCell, hidden: true });
    }

    if (selectedColumn) {
      let column = columnList.current.find(
        ({ id }) => id === selectedColumn!.id
      );
      if (column) setSelectedColumn({ ...column, hidden: false });
      else setSelectedColumn({ ...selectedColumn, hidden: true });
    }

    if (selectedRow) {
      let row = rowList.current.find(({ id }) => id === selectedRow!.id);
      if (row) setSelectedRow({ ...row, hidden: false });
      else setSelectedRow({ ...selectedRow, hidden: true });
    }
  };

  let renderGrid: IRenderGrid = ({ colStart, rowStart }) => {
    let ctx = ctxRef.current;

    if (!ctx) return;

    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    let y = cell.height;

    cellList.current = [];
    rowList.current = [];
    columnList.current = [];
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    let isColumnRendered = false;
    isReachedRight.current = false;

    for (let row = rowStart; row <= totalRows && y < canvasHeight; row++) {
      let height = rows[row]?.height || cell.height;
      let x = cell.width / 2;
      let rowRect = {
        x: 0,
        y,
        height,
        id: row,
        width: cell.width / 2,
      };

      renderGridRow(ctx, rowRect);
      rowList.current.push(rowRect);

      for (
        let column = colStart;
        column <= columnIds.length && x < canvasWidth;
        column++
      ) {
        let columnId = columnIds[column - 1];

        if (columnId === "null") {
          if (isReachedRight.current) break;
          closeRightGrid(ctx, { x, y: cell.height });
          break;
        }

        let cellId = `${columnId}${row}`;
        let width = columns[columnId]?.width || cell.width;
        let props = cells[cellId];
        let columnRect = {
          x,
          y: 0,
          width,
          id: column,
          height: cell.height,
        };
        let rect: ICellRect = {
          x,
          y,
          width,
          height,
          row: rowRect,
          column: columnRect,
          id: cellId,
        };

        if (!isColumnRendered) {
          renderGridColumn(ctx, { x, width, id: columnId });
          columnList.current.push(columnRect);
        }

        renderGridCell(ctx, rect, props);
        cellList.current.push(rect);

        x += width;
      }

      y += height;
      isColumnRendered = true;
    }

    renderTopLeftBox(ctx);
    handleUpdateSelectedOne();
    isReachedBottom.current = rowList.current.at(-1)!.id === totalRows;
  };

  const handleScroll = (event: WheelEvent) => {
    let ctx = ctxRef.current;

    if (!ctx) return;

    let { deltaY, deltaX } = event;

    let key: keyof IScrollPosition = deltaY === 0 ? "left" : "top";

    let rowStart = rowList.current[0].id;
    let colStart = columnList.current[0].id;

    if (key === "top") {
      if (deltaY > 0 && isReachedBottom.current) return;

      let scrollBy = 2;

      rowStart = Math.max(
        1,
        deltaY > 0 ? rowStart + scrollBy : rowStart - scrollBy
      );
    } else {
      if (deltaX > 0 && isReachedRight.current) return;

      let scrollBy = 1;

      colStart = Math.max(
        1,
        deltaX > 0 ? colStart + scrollBy : colStart - scrollBy
      );
    }

    renderGrid({
      rowStart,
      colStart,
    });
  };

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  let handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;

    let { top, left } = gridRef.current.getBoundingClientRect();
    let { clientX, clientY } = event;

    let offsetX = clientX - left;
    let offsetY = clientY - top;

    let selectedCell: ISelectedCell = undefined;
    let selectedColumn: ISelectedColumn = undefined;
    let selectedRow: ISelectedRow = undefined;

    if (offsetY <= cell.height) {
      let column = columnList.current.find(
        ({ x, y, width }) =>
          offsetX >= x &&
          offsetX <= x + width &&
          offsetY >= y &&
          offsetY <= y + cell.height
      );
      if (column) selectedColumn = { ...column, hidden: false };
    } else if (offsetX <= cell.width / 2) {
      let row = rowList.current.find(
        ({ x, y, height }) =>
          offsetX >= x &&
          offsetX <= x + cell.width &&
          offsetY >= y &&
          offsetY <= y + height
      );
      if (row) selectedRow = { ...row, hidden: false };
    } else {
      let cell = cellList.current.find(
        ({ width, height, x, y }) =>
          offsetX >= x &&
          offsetX <= x + width &&
          offsetY >= y &&
          offsetY <= y + height
      );

      if (cell) selectedCell = { ...cell, hidden: false };
    }

    setSelectedCell(selectedCell);
    setSelectedRow(selectedRow);
    setSelectedColumn(selectedColumn);
  };

  let selectedCellStyle = useMemo(() => {
    if (!selectedCell) return {};

    return {
      cell: {
        width: selectedCell.width + "px",
        height: selectedCell.height + "px",
        top: selectedCell.y + "px",
        left: selectedCell.x + "px",
      },
      row: {
        width: selectedCell.row.width + "px",
        height: selectedCell.row.height + "px",
        top: selectedCell.row.y + "px",
        left: selectedCell.row.x + "px",
      },
      column: {
        width: selectedCell.column.width + "px",
        height: selectedCell.column.height + "px",
        top: selectedCell.column.y + "px",
        left: selectedCell.column.x + "px",
      },
    };
  }, [selectedCell]);

  let selectedRowStyle = useMemo(() => {
    if (!selectedRow) return {};

    return {
      left: selectedRow.x + "px",
      top: selectedRow.y + "px",
      height: selectedRow.height + "px",
      "--cell-width": selectedRow.width + "px",
    };
  }, [selectedRow]);

  let selectedColumnStyle = useMemo(() => {
    if (!selectedColumn) return {};

    return {
      width: selectedColumn.width + "px",
      left: selectedColumn.x + "px",
      top: selectedColumn.y + "px",
      "--cell-height": selectedColumn.height + "px",
    };
  }, [selectedColumn]);

  return (
    <div
      ref={gridRef}
      className={styles.container}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      onWheel={throttle(handleScroll, 50)}
    >
      {selectedCell && !selectedCell.hidden && (
        <Fragment>
          <div
            className={styles.selected_cell}
            style={selectedCellStyle.cell}
          ></div>
          <div
            className={styles.selected_cell_highlight}
            style={selectedCellStyle.row}
          >
            <b>{selectedCell.row.id}</b>
          </div>
          <div
            className={styles.selected_cell_highlight}
            style={selectedCellStyle.column}
          >
            <b>{columnIds[selectedCell.column.id - 1]}</b>
          </div>
        </Fragment>
      )}
      {selectedRow && !selectedRow.hidden && (
        <div className={styles.selected_row} style={selectedRowStyle}>
          <div className={styles.title}>
            <b>{selectedRow.id}</b>
          </div>
          <div className={styles.highlight} aria-label="row"></div>
        </div>
      )}
      {selectedColumn && !selectedColumn.hidden && (
        <div className={styles.selected_column} style={selectedColumnStyle}>
          <div className={styles.column}></div>
          <div className={styles.title}>
            <b>{columnIds[selectedColumn.id - 1]}</b>
          </div>
          <div className={styles.highlight} aria-label="column"></div>
        </div>
      )}
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Grid;
