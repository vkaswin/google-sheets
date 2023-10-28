export type IRow = {
  id: string;
  rowId: number;
} & IRect;

export type IColumn = {
  id: string;
  columnId: number;
} & IRect;

export type ICell = {
  id: string;
  rowId: string;
  columnId: string;
} & IRect;

export type ICellProps = {
  content?: string;
  backgroundColor?: string;
  color?: string;
};

export type IRowProps = {
  height?: number;
  backgroundColor?: string;
};

export type IColumnProps = {
  width?: number;
  backgroundColor?: string;
};

export type ISheetDetail = {
  rows: Record<string, IRowProps>;
  columns: Record<string, IColumnProps>;
  cells: Record<string, ICellProps>;
};

export type IRenderGrid = (data: {
  offsetX: number;
  offsetY: number;
  rowStart: number;
  colStart: number;
}) => void;

export type IPaintRow = (ctx: CanvasRenderingContext2D, row: IRow) => void;

export type IPaintColumn = (
  ctx: CanvasRenderingContext2D,
  column: IColumn
) => void;

export type IPaintCell = (ctx: CanvasRenderingContext2D, cell: ICell) => void;

export type IRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type IPaintCellBg = (
  ctx: CanvasRenderingContext2D,
  backgroundColor: string,
  data: IRect
) => void;

export type IPaintCellLine = (
  ctx: CanvasRenderingContext2D,
  data: IRect
) => void;

export type IPaintCellContent = (
  ctx: CanvasRenderingContext2D,
  content: string,
  data: IRect
) => void;
