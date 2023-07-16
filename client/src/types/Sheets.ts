export type IScrollPosition = {
  x: number;
  y: number;
};

export type IRenderGridRow = (
  ctx: CanvasRenderingContext2D,
  props: {
    x: number;
    y: number;
    height: number;
    text?: string;
  }
) => void;

export type IRenderGridColumns = (ctx: CanvasRenderingContext2D) => void;

export type IGridCellStyle = (ctx: CanvasRenderingContext2D) => void;

export type IRenderGridColumn = (
  ctx: CanvasRenderingContext2D,
  props: {
    x: number;
    y: number;
    width: number;
    text?: string;
  }
) => void;

export type IGridColumnStyle = (ctx: CanvasRenderingContext2D) => void;

export type IGridRowStyle = (ctx: CanvasRenderingContext2D) => void;

export type ISheetData = {
  meta: ISheetMeta;
  rows: ISheetRows;
  columns: ISheetColumns;
  cells: ISheetCells;
};

export type ISheetMeta = {
  totalRows: number;
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

export type IGridCells = Map<
  string,
  { rowRect: Pick<ICellRect, "x" | "y">; cellsRect: Map<string, ICellRect> }
>;

export type ICellRect = {
  cellId: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type IClearCanvas = (
  ctx: CanvasRenderingContext2D,
  virtualCtx: CanvasRenderingContext2D
) => void;

export type IRenderGridYAxisDownWard = (
  ctx: CanvasRenderingContext2D,
  virtualCtx: CanvasRenderingContext2D
) => void;
