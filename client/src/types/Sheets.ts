export type IRow = {
  rowId: number;
} & IRect;

export type IColumn = {
  columnId: number;
} & IRect;

export type ICell = {
  cellId: string;
  rowId: number;
  columnId: number;
} & IRect;

export type IRowDetails = Record<string, { rowId: number; height: number }>;

export type IColumnDetails = Record<
  string,
  { columnId: number; width: number }
>;

export type ICellDetails = Record<
  string,
  ICellProps & Pick<ICell, "rowId" | "columnId">
>;

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
  rows: { rowId: number; height: number }[];
  columns: { columnId: number; width: number }[];
  cells: (ICellProps & { rowId: number; columnId: number })[];
};

export type IRenderGrid = (data: {
  offsetX: number;
  offsetY: number;
  rowStart: number;
  colStart: number;
}) => void;

export type IRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
