type IRow = {
  rowId: number;
} & IRect;

type IColumn = {
  columnId: number;
} & IRect;

type ICell = {
  cellId: string;
  rowId: number;
  columnId: number;
} & IRect;

type IRowDetails = Record<string, { rowId: number; height: number }>;

type IColumnDetails = Record<string, { columnId: number; width: number }>;

type ICellDetails = Record<
  string,
  ICellProps & Pick<ICell, "rowId" | "columnId">
>;

type ICellProps = {
  html?: string;
  backgroundColor?: string;
  color?: string;
};

type IRowProps = {
  height?: number;
  backgroundColor?: string;
};

type IColumnProps = {
  width?: number;
  backgroundColor?: string;
};

type ISheetDetail = {
  rows: { rowId: number; height: number }[];
  columns: { columnId: number; width: number }[];
  cells: (ICellProps & { rowId: number; columnId: number })[];
};

type IRenderGrid = (data: {
  offsetX: number;
  offsetY: number;
  rowStart: number;
  colStart: number;
}) => void;

type IRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type IPaintCell = (ctx: CanvasRenderingContext2D, rect: ICell) => void;

type IPaintRect = (
  ctx: CanvasRenderingContext2D,
  backgroundColor: string,
  rect: IRect
) => void;

type IPaintCellLine = (ctx: CanvasRenderingContext2D, rect: IRect) => void;

type IPaintCellHtml = (
  ctx: CanvasRenderingContext2D,
  html: string,
  rect: IRect
) => void;

type IFormatTypes =
  | "bold"
  | "italic"
  | "underline"
  | "lineThrough"
  | "color"
  | "backgroundColor";

type IFormatText = (type: IFormatTypes, value?: string) => void;

type IEditorRef = {
  formatText: IFormatText;
  on: (type: "change", cb: (data: string) => void) => void;
};
