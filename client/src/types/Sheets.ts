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
  text: string;
  backgroundColor?: string;
  content: any[];
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

type IPaintCellContent = (
  ctx: CanvasRenderingContext2D,
  content: any[][],
  rect: IRect
) => void;

type IFormatTypes =
  | "bold"
  | "italic"
  | "strike"
  | "underline"
  | "color"
  | "background"
  | "border"
  | "align"
  | "direction"
  | "font"
  | "size";

type IFormatText = (type: IFormatTypes, value: string | boolean) => void;

type ILineProps = {
  width: number;
  text: string;
  font: string;
  color: string;
};

type ILine = {
  y: number;
  props: ILineProps[];
};
