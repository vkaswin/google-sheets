import {
  useEffect,
  useRef,
  MouseEvent,
  WheelEvent,
  Fragment,
  useLayoutEffect,
} from "react";
import { useSheet } from "@/hooks/useSheet";
import ColumnOverLay from "./ColumnOverLay";
import RowOverLay from "./RowOverLay";
import RowResizer from "./RowResizer";
import ColumnResizer from "./ColumnResizer";
import AutoFill from "./AutoFill";
import HighLightRow from "./HighLightRow";
import HighLightColumn from "./HighLightColumn";
import HighLightSearchCells from "./HighLightSearchCells";
import ScrollBar from "./ScrollBar";
import Loader from "@/components/Loader";
import EditCell from "./EditCell";
import ContextMenu from "./ContextMenu";
import HighLightCell from "./HighLightCell";
import { config } from "@/constants";
import { convertToTitle } from "@/utils";

const Grid = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const verticalScroll = useRef<HTMLDivElement | null>(null);

  const horizontalScroll = useRef<HTMLDivElement | null>(null);

  const scrollPosition = useRef({
    top: 0,
    left: 0,
  });

  const {
    grid,
    scale,
    isGridLoading,
    syncState,
    editCell,
    selectedCell,
    selectedColumn,
    selectedRow,
    highLightCells,
    contextMenuRect,
    copiedCell,
    activeHighLightIndex,
    setGrid,
    getCellById,
    getColumnById,
    getRowById,
    setContextMenuRect,
    setSelectedCellId,
    setEditCell,
    setCopyCellId,
    setSelectedColumnId,
    setSelectedRowId,
    handleDeleteCell,
    handleDeleteColumn,
    handleDeleteRow,
    handleInsertColumn,
    handleInsertRow,
    handleCopyCell,
    handleCutCell,
    handlePasteCell,
    handleResizeRow,
    handleResizeColumn,
    handleAutoFillCell,
  } = useSheet();

  let { rows, columns, cells } = grid;

  useEffect(() => {
    changeCanvasDimension();

    document.fonts.addEventListener(
      "loadingdone",
      () => {
        if (isGridLoading) return;
        handleResizeGrid();
      },
      { once: true }
    );
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell, copiedCell]);

  useEffect(() => {
    if (!syncState) return;
    handleResizeGrid();
  }, [syncState, scale]);

  useEffect(() => {
    window.addEventListener("resize", handleResizeGrid);
    return () => {
      window.removeEventListener("resize", handleResizeGrid);
    };
  }, [grid]);

  useEffect(() => {
    if (!selectedCell && !selectedColumn && !selectedRow) return;
    paintHeaders(rows, columns);
  }, [selectedCell, selectedColumn, selectedRow]);

  useEffect(() => {
    handleNavigateSearch();
  }, [activeHighLightIndex]);

  useLayoutEffect(() => {
    paintGrid();
  }, [grid]);

  useEffect(() => {
    let styles: Record<string, string> = {
      "--row-height": `${config.rowHeight * scale}px`,
      "--col-width": `${config.colWidth * scale}px`,
      "--cell-width": `${config.cellWidth * scale}px`,
      "--cell-height": `${config.cellHeight * scale}px`,
      "--scrollbar-size": `${config.scrollBarSize * scale}px`,
      "--scrollbar-thumb-size": `${config.scrollThumbSize * scale}px`,
    };

    for (let key in styles) {
      document.documentElement.style.setProperty(key, styles[key]);
    }
  }, [scale]);

  const changeCanvasDimension = () => {
    if (!canvasRef.current || !gridRef.current) return;
    let { clientWidth, clientHeight } = gridRef.current;
    canvasRef.current.width = clientWidth;
    canvasRef.current.height = clientHeight;
  };

  const handleResizeGrid = (event?: Event) => {
    if (event && event.type === "resize") changeCanvasDimension();

    let { rowId, y } = rows[0] ?? {};
    let { columnId, x } = columns[0] ?? {};

    renderGrid({
      offsetX: x,
      offsetY: y,
      rowStart: rowId,
      colStart: columnId,
    });
  };

  const paintGrid = () => {
    if (
      !canvasRef.current ||
      (!grid.cells.length && !grid.columns.length && !grid.rows.length)
    )
      return;

    let { clientWidth, clientHeight } = canvasRef.current;

    let ctx = canvasRef.current.getContext("2d")!;

    ctx.clearRect(0, 0, clientWidth, clientHeight);

    paintCells(ctx, grid.cells);
    paintHeaders(grid.rows, grid.columns);
  };

  const paintCells: IPaintCells = (
    ctx: CanvasRenderingContext2D,
    cells: ICell[]
  ) => {
    for (let cell of cells) {
      paintCell(ctx, cell);
    }
  };

  const paintRow = (
    ctx: CanvasRenderingContext2D,
    highlight: boolean,
    { height, rowId, width, x, y }: IRow
  ) => {
    paintRect(ctx, highlight ? "#D3E3FD" : "#FFFFFF", { height, width, x, y });

    ctx.save();
    ctx.strokeStyle = config.strokeStyle;
    ctx.lineWidth = config.lineWidth;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${12 * scale}px Open Sans Medium`;
    ctx.fillStyle = highlight ? "#000000" : "#575a5a";
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.stroke();
    ctx.fillText(rowId.toString(), x + width / 2 + 1, y + height / 2 + 1);
    ctx.restore();
  };

  const paintColumn = (
    ctx: CanvasRenderingContext2D,
    highlight: boolean,
    { columnId, height, width, x, y }: IColumn
  ) => {
    paintRect(ctx, highlight ? "#D3E3FD" : "#FFFFFF", { height, width, x, y });
    ctx.save();
    ctx.strokeStyle = config.strokeStyle;
    ctx.lineWidth = config.lineWidth;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${12 * scale}px Open Sans Medium`;
    ctx.fillStyle = highlight ? "#000000" : "#575a5a";
    ctx.beginPath();
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.stroke();
    ctx.fillText(
      convertToTitle(columnId),
      x + width / 2 + 1,
      y + height / 2 + 1
    );
    ctx.restore();
  };

  const paintRect: IPaintRect = (
    ctx,
    backgroundColor,
    { x, y, height, width }
  ) => {
    ctx.save();
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.fillRect(x, y, width, height);
    ctx.fill();
    ctx.restore();
  };

  const paintCellLine: IPaintCellLine = (ctx, { height, width, x, y }) => {
    ctx.save();
    ctx.strokeStyle = config.strokeStyle;
    ctx.lineWidth = config.lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    ctx.restore();
  };

  const paintCellContent: IPaintCellContent = (ctx, content, { x, y }) => {
    if (!canvasRef.current || !content?.length) return;

    let arr: any[] = [{ maxFont: 0, content: [] }];

    let offsetX = x;

    for (let ops of content) {
      if (ops.insert === "\n") {
        offsetX = x;
        arr.push({ maxFont: 0, content: [] });
        continue;
      }

      let {
        attributes: {
          strike = false,
          color = "#000000",
          bold = false,
          italic = false,
          underline = false,
          font = config.defaultFont,
          size = config.defaultFontSize,
        } = {},
        insert,
      } = ops;

      let fontStyle = "";
      let fontSize = +size.replace("px", "") * scale;

      ctx.fillStyle = color;
      if (bold) fontStyle += "bold ";
      if (italic) fontStyle += "italic ";
      fontStyle += `${fontSize}px ${config.fonts[font]}`;
      ctx.font = fontStyle;

      let width = ctx.measureText(insert).width;

      let data: any = {
        fontStyle,
        offsetX,
        color,
        text: insert,
        underline,
        strike,
        width,
        fontSize,
      };

      arr[arr.length - 1].maxFont = Math.max(
        arr[arr.length - 1].maxFont,
        fontSize
      );

      arr[arr.length - 1].content.push(data);

      offsetX += width;
    }

    let offsetY = y;

    for (let { maxFont, content } of arr) {
      offsetY += maxFont;

      for (let props of content) {
        let {
          offsetX,
          fontStyle,
          color,
          text,
          underline,
          strike,
          width,
          fontSize,
        } = props;

        ctx.save();
        ctx.fillStyle = color;
        ctx.font = fontStyle;
        ctx.fillText(text, offsetX, offsetY);
        ctx.restore();

        if (underline || strike) {
          ctx.save();
          ctx.strokeStyle = color || "#000000";

          if (underline) {
            let offset = 2 * scale;
            ctx.lineWidth = 1 * scale;
            ctx.strokeRect(offsetX, offsetY + offset, width, 0);
          }

          if (strike) {
            let offset = 3 * scale;
            ctx.lineWidth = 1 * scale;
            ctx.strokeRect(offsetX, offsetY - fontSize / 2 + offset, width, 0);
          }

          ctx.restore();
        }
      }
    }
  };

  const paintCell: IPaintCell = (ctx, { cellId, height, width, x, y }) => {
    let { background = "#FFFFFF", content = [] } = getCellById(cellId) ?? {};

    let rect = { x, y, width, height };

    paintRect(ctx, background, rect);
    paintCellContent(ctx, content, rect);
    paintCellLine(ctx, rect);
  };

  const paintBox = () => {
    if (!canvasRef.current) return;

    let ctx = canvasRef.current.getContext("2d")!;
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = config.strokeStyle;
    ctx.lineWidth = config.lineWidth - 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.fillRect(0, 0, config.colWidth * scale, config.rowHeight * scale);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.strokeRect(0, 1, config.colWidth * scale, config.rowHeight * scale - 1);
    ctx.stroke();
    ctx.restore();
  };

  const paintRows = (rows: IRow[]) => {
    if (!canvasRef.current || !rows.length) return;

    let ctx = canvasRef.current.getContext("2d")!;

    let activeRowId = selectedCell?.rowId;

    for (let row of rows) {
      let highlight = row.rowId === activeRowId || !!selectedColumn;
      paintRow(ctx, highlight, row);
    }

    ctx.save();
    ctx.strokeStyle = config.strokeStyle;
    ctx.lineWidth = config.lineWidth - 0.5;
    ctx.beginPath();
    ctx.moveTo(0, config.rowHeight * scale);
    ctx.lineTo(0, canvasRef.current.clientHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(config.colWidth * scale, config.rowHeight * scale);
    ctx.lineTo(config.colWidth * scale, canvasRef.current.clientHeight);
    ctx.stroke();
    ctx.restore();
  };

  const paintColumns = (columns: IColumn[]) => {
    if (!canvasRef.current || !columns.length) return;

    let ctx = canvasRef.current.getContext("2d")!;

    let activeColumnId = selectedCell?.columnId;

    for (let column of columns) {
      let highlight = column.columnId === activeColumnId || !!selectedRow;
      paintColumn(ctx, highlight, column);
    }

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = config.strokeStyle;
    ctx.lineWidth = config.lineWidth - 0.5;
    ctx.moveTo(config.colWidth * scale, config.rowHeight * scale);
    ctx.lineTo(canvasRef.current.clientWidth, config.rowHeight * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(config.colWidth * scale, 1);
    ctx.lineTo(canvasRef.current.clientWidth, 1);
    ctx.stroke();
    ctx.restore();
  };

  const paintHeaders = (rows: IRow[], columns: IColumn[]) => {
    paintRows(rows);
    paintColumns(columns);
    paintBox();
  };

  const renderGrid: IRenderGrid = ({
    offsetX = config.colWidth * scale,
    offsetY = config.rowHeight * scale,
    rowStart = 1,
    colStart = 1,
  }) => {
    if (!canvasRef.current) return;

    let { width, height } = canvasRef.current;

    let rowData: IRow[] = [];
    let columnData: IColumn[] = [];
    let cellData: ICell[] = [];

    for (let i = rowStart, y = offsetY; y < height; i++) {
      let height = (getRowById(i)?.height || config.cellHeight) * scale;

      if (y + height > config.rowHeight * scale) {
        rowData.push({
          y,
          x: 0,
          rowId: i,
          height,
          width: config.colWidth * scale,
        });
      }

      y += height;
    }

    for (let i = colStart, x = offsetX; x < width; i++) {
      let width = (getColumnById(i)?.width || config.cellWidth) * scale;

      if (x + width > config.colWidth * scale) {
        columnData.push({
          x,
          y: 0,
          columnId: i,
          width,
          height: config.rowHeight * scale,
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
      }
    }

    setGrid({
      cells: cellData,
      columns: columnData,
      rows: rowData,
    });
  };

  const handleVerticalScroll = (deltaY: number) => {
    if (!gridRef.current || !rows.length || !columns.length) return;

    let { rowId, y } = rows[0];
    let { columnId, x } = columns[0];

    if (deltaY < 0) {
      // Scroll upwards
      y += -deltaY;
      rowId--;

      while (rowId > 0 && y > config.rowHeight * scale) {
        y -= (getRowById(rowId)?.height || config.cellHeight) * scale;
        rowId--;
      }

      let offsetY = Math.min(config.rowHeight * scale, y);

      renderGrid({
        offsetX: x,
        offsetY,
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

    let scrollTop = Math.max(0, scrollPosition.current.top + deltaY);

    scrollPosition.current.top = scrollTop;

    if (!verticalScroll.current) return;

    let { height } = gridRef.current.getBoundingClientRect();

    verticalScroll.current.style.top = `${
      scrollTop % (height - (config.scrollBarSize - config.scrollThumbSize))
    }px`;
  };

  const handleHorizontalScroll = (deltaX: number) => {
    if (!gridRef.current || !rows.length || !columns.length) return;

    let { rowId, y } = rows[0];
    let { columnId, x } = columns[0];

    if (deltaX < 0) {
      // Scroll leftwards
      x += -deltaX;
      columnId--;

      while (columnId > 0 && x > config.colWidth * scale) {
        x -= (getColumnById(columnId)?.width || config.cellWidth) * scale;
        columnId--;
      }

      renderGrid({
        offsetX: Math.min(config.colWidth * scale, x),
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

    let scrollLeft = Math.max(0, scrollPosition.current.left + deltaX);

    scrollPosition.current.left = scrollLeft;

    if (!horizontalScroll.current) return;

    let { width } = gridRef.current.getBoundingClientRect();

    horizontalScroll.current.style.left = `${
      scrollLeft % (width - (config.scrollBarSize - config.scrollThumbSize))
    }px`;
  };

  const handleScroll = (event: WheelEvent) => {
    let { deltaX, deltaY } = event;

    if (deltaX === 0) handleVerticalScroll(deltaY);
    else handleHorizontalScroll(deltaX);
  };

  const handleClickGrid = (event: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;

    let { left, top } = gridRef.current.getBoundingClientRect();

    let x = event.pageX - left;
    let y = event.pageY - top;

    let cellId = getCellIdByCoordiantes(x, y);

    if (!cellId) return;

    setSelectedCellId(cellId);
    setEditCell(null);
    setSelectedColumnId(null);
    setSelectedRowId(null);
    setContextMenuRect(null);
  };

  const getCellIdByCoordiantes = (x: number, y: number) => {
    let { rows, columns } = grid;

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

  const handleDoubleClickGrid = () => {
    if (!gridRef.current || !selectedCell) return;

    let { columnId, cellId, width, height, rowId, x, y } = selectedCell;

    let { top } = gridRef.current.getBoundingClientRect();

    setSelectedCellId(null);
    setCopyCellId(null);
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

  const handleClickColumn = (columnId: number) => {
    setSelectedColumnId(columnId);
    setSelectedRowId(null);
    setSelectedCellId(null);
    setEditCell(null);
    setContextMenuRect(null);
  };

  const handleClickRow = (rowId: number) => {
    setSelectedRowId(rowId);
    setSelectedColumnId(null);
    setSelectedCellId(null);
    setEditCell(null);
    setContextMenuRect(null);
  };

  const handleNavigateSearch = () => {
    if (
      !gridRef.current ||
      !highLightCells.length ||
      activeHighLightIndex === null
    )
      return;

    let cellData = getCellById(highLightCells[activeHighLightIndex]);

    if (!cellData) return;

    let isVisible = cells.some(
      (cell) =>
        cell.rowId === cellData!.rowId && cell.columnId === cellData!.columnId
    );

    if (isVisible) return;

    renderGrid({
      rowStart: cellData.rowId,
      colStart: cellData.columnId,
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!selectedCell) return;

    let { ctrlKey, key } = event;

    if (ctrlKey && key === "c") handleCopyCell();
    else if (ctrlKey && key === "v") handlePasteCell();
  };

  return (
    <Fragment>
      <div
        ref={gridRef}
        className="relative w-[var(--grid-width)] h-[var(--grid-height)] select-none overflow-hidden"
        onWheel={handleScroll}
        onMouseDown={handleClickGrid}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClickGrid}
      >
        {isGridLoading && <Loader />}
        <canvas ref={canvasRef}></canvas>
        <ScrollBar
          ref={verticalScroll}
          axis="y"
          onScroll={handleVerticalScroll}
        />
        <ScrollBar
          ref={horizontalScroll}
          axis="x"
          onScroll={handleHorizontalScroll}
        />
        {selectedColumn && (
          <HighLightColumn scale={scale} column={selectedColumn} />
        )}
        {selectedRow && <HighLightRow scale={scale} row={selectedRow} />}
        <div className="absolute left-[var(--col-width)] top-[var(--row-height)] w-[calc(100%-var(--col-width))] h-[calc(100%-var(--row-height))] overflow-hidden">
          {copiedCell && <HighLightCell cell={copiedCell} dashed />}
          {selectedCell && !editCell && selectedCell !== copiedCell && (
            <Fragment>
              <HighLightCell cell={selectedCell} />
              <AutoFill
                cells={cells}
                gridRef={gridRef}
                selectedCell={selectedCell}
                getCellById={getCellById}
                onAutoFillCell={handleAutoFillCell}
                getCellIdByCoordiantes={getCellIdByCoordiantes}
              />
            </Fragment>
          )}
          {selectedColumn && <ColumnOverLay column={selectedColumn} />}
          {selectedRow && <RowOverLay row={selectedRow} />}
          {!!highLightCells.length && activeHighLightIndex !== null && (
            <HighLightSearchCells
              cells={cells}
              highLightCells={highLightCells}
              activeHighLightIndex={activeHighLightIndex}
              getCellById={getCellById}
            />
          )}
        </div>
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
      </div>
      {editCell && (
        <EditCell cell={editCell} data={getCellById(editCell?.cellId)} />
      )}
      {contextMenuRect && (
        <ContextMenu
          rect={contextMenuRect}
          isCellSelected={!!selectedCell}
          isColumnSelected={!!selectedColumn}
          isRowSelected={!!selectedRow}
          onCopy={handleCopyCell}
          onCut={handleCutCell}
          onPaste={handlePasteCell}
          onDeleteCell={handleDeleteCell}
          onDeleteColumn={handleDeleteColumn}
          onDeleteRow={handleDeleteRow}
          onInsertColumn={handleInsertColumn}
          onInsertRow={handleInsertRow}
        />
      )}
    </Fragment>
  );
};

export default Grid;
