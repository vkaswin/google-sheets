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
import GridColumns from "./GridColumns";
import GridRows from "./GridRows";
import GridCells from "./GridCells";
import { convertToTitle } from "@/utils";
import { data } from "../data";

import {
  ICell,
  IColumn,
  IRow,
  IRenderGrid,
  IPaintCellBg,
  IPaintColumn,
  IPaintRow,
  IPaintCell,
  IPaintCellLine,
  IRect,
  IPaintCellContent,
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

  const [cells, setCells] = useState<Record<string, ICell>>({});

  const [selectedCellId, setSelectedCellId] = useState<string>("");

  const [editCell, setEditCell] = useState<ICell | null>(null);

  const [sheetDetail, setSheetDetail] = useState(data);

  const gridRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedCell = useMemo(() => {
    return cells[selectedCellId];
  }, [rows, columns, selectedCellId]);

  useEffect(() => {
    handleResizeGrid();
  }, [sheetDetail]);

  useEffect(() => {
    window.addEventListener("resize", handleResizeGrid);

    return () => {
      window.removeEventListener("resize", handleResizeGrid);
    };
  }, [rows, columns, sheetDetail]);

  const handleResizeGrid = () => {
    if (!gridRef.current) return;

    let { rowId = 1, y = rowHeight } = rows[0] ?? {};
    let { columnId = 1, x = colWidth } = columns[0] ?? {};

    renderGrid({
      offsetX: x,
      offsetY: y,
      rowStart: rowId,
      colStart: columnId,
    });
  };

  const renderGrid: IRenderGrid = ({
    offsetX,
    offsetY,
    rowStart,
    colStart,
  }) => {
    if (!gridRef.current) return;

    let { clientWidth, clientHeight } = gridRef.current;

    let rowData: IRow[] = [];
    let columnData: IColumn[] = [];
    let cellData: Record<string, ICell> = {};

    for (let i = rowStart, y = offsetY; y < clientHeight; i++) {
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

    for (let i = colStart, x = offsetX; x < clientWidth; i++) {
      let columnId = convertToTitle(i);
      let width = sheetDetail.columns[columnId]?.width || cell.width;

      if (x + width > colWidth) {
        columnData.push({
          x,
          y: 0,
          id: columnId,
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
      }
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
        rowId = rows[mid].id;
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
        columnId = columns[mid].id;
      } else {
        right = mid - 1;
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

  const handleDoubleClickCell = () => {
    if (!gridRef.current || !selectedCellId || !cells[selectedCellId]) return;

    let { columnId, id, width, height, rowId, x, y } = cells[selectedCellId];

    let { top } = gridRef.current.getBoundingClientRect();

    setEditCell({
      columnId,
      id,
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

  const handleClickColumn = (columnId: string) => {
    console.log(columnId);
  };

  const handleClickRow = (rowId: string) => {
    console.log(rowId);
  };

  const handleResizeColumn = (columnId: string, value: number) => {
    let details = { ...sheetDetail };
    if (!details.columns[columnId]) details.columns[columnId] = {};
    details.columns[columnId].width = value;
    setSheetDetail(details);
  };

  const handleResizeRow = (rowId: string, value: number) => {
    let details = { ...sheetDetail };
    if (!details.rows[rowId]) details.columns[rowId] = {};
    details.rows[rowId].height = value;
    setSheetDetail(details);
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
        <div className="absolute left-0 top-0 w-[var(--col-width)] h-[var(--row-height)] border border-light-gray bg-white z-20 after:absolute after:right-0 after:h-full after:w-1 after:bg-dark-silver before:absolute before:bottom-0 before:w-full before:h-1 before:bg-dark-silver"></div>
        <GridColumns
          columns={columns}
          selectedId={selectedCell?.columnId}
          onClick={handleClickColumn}
          onResize={handleResizeColumn}
        />
        <GridRows
          rows={rows}
          slectedId={selectedCell?.rowId}
          onClick={handleClickRow}
          onResize={handleResizeRow}
        />
        <GridCells cells={cells} data={data.cells} />
        {!editCell && selectedCell && (
          <HighlightCell
            cell={selectedCell}
            onDoubleClick={handleDoubleClickCell}
          />
        )}
      </div>
      {editCell && (
        <EditCell
          cell={editCell}
          data={sheetDetail.cells[editCell.id]}
          onWheel={handleScroll}
        />
      )}
    </Fragment>
  );
};

export default Grid;
