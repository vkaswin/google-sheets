export type IScrollPosition = {
  top: number;
  left: number;
};

export type IRenderGridRow = (
  ctx: CanvasRenderingContext2D,
  props: {
    x: number;
    y: number;
    height: number;
    rowId: string;
  }
) => void;

export type IGridCellStyle = (ctx: CanvasRenderingContext2D) => void;

export type IRenderGridColumn = (
  ctx: CanvasRenderingContext2D,
  props: {
    offsetX: number;
    width: number;
    columnId: string;
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

export type ICellList = ICellRect[];

export type IRowList = Omit<ICellRect, "width">[];

export type IColumnList = Omit<ICellRect, "height">[];

export type ICellRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type IGridLineStyle = (ctx: CanvasRenderingContext2D) => void;

export type IRenderGridCellLine = (
  ctx: CanvasRenderingContext2D,
  rect: ICellRect
) => void;

export type IRenderGrid = (data: {
  offsetX: number;
  offsetY: number;
  rowStart: number;
  colStart: number;
}) => void;
