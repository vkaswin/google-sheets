export type IScrollPosition = {
  top: number;
  left: number;
};

export type IRenderGridRow = (
  ctx: CanvasRenderingContext2D,
  props: IRowRect
) => void;

export type IGridCellStyle = (ctx: CanvasRenderingContext2D) => void;

export type IRenderGridColumn = (
  ctx: CanvasRenderingContext2D,
  props: {
    x: number;
    width: number;
    id: string;
  }
) => void;

export type ISheetData = {
  meta: ISheetMeta;
  rows: ISheetRows;
  columns: ISheetColumns;
  cells: ISheetCells;
};

export type ISheetMeta = {
  totalRows: number;
  dimension: { width: number; height: number };
  columnIds: string[];
};

export type ISheetCells = Record<string, ICellProps>;

export type ISheetRows = Record<string, { height?: number }>;

export type ISheetColumns = Record<string, { width?: number }>;

export type ICellProps = {
  text?: string;
  backgroundColor?: string;
  color?: string;
};

export type IRenderGridCell = (
  ctx: CanvasRenderingContext2D,
  rect: ICellRect,
  props: ICellProps
) => void;

export type IRowRect = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type IColumnRect = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ICellRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type IGridLineStyle = (ctx: CanvasRenderingContext2D) => void;

export type ISelectedCell = (ICellRect & { hidden: boolean }) | undefined;

export type ISelectedRow = (IRowRect & { hidden: boolean }) | undefined;

export type ISelectedColumn = (IColumnRect & { hidden: boolean }) | undefined;

export type IRenderGridCellLine = (
  ctx: CanvasRenderingContext2D,
  rect: ICellRect
) => void;

export type IRenderGrid = (data: {
  rowStart: number;
  colStart: number;
}) => void;

export type ICloseRightGrid = (
  ctx: CanvasRenderingContext2D,
  data: { x: number; y: number }
) => void;
