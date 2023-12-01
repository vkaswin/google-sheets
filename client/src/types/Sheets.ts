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
  text?: string;
  content?: any[];
  background?: string;
  color?: string;
  textAlign?: string;
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
  content: any[],
  cellColor: string,
  rect: IRect
) => void;

type IPickerOptions = "background" | "color";

type IFormatTypes =
  | "bold"
  | "italic"
  | "strike"
  | "underline"
  | "align"
  | "direction"
  | "font"
  | "size"
  | "textAlign"
  | IPickerOptions;

type IFormatText = (type: IFormatTypes, value: string | boolean) => void;

type IActiveStyle = {
  bold: boolean;
  strike: boolean;
  italic: boolean;
  font: string;
  underline: boolean;
  background: string;
  color: string;
  alignLeft: boolean;
  alignRight: boolean;
  alignMiddle: boolean;
  link: boolean;
};

type ICellFormat = (
  key: "backgroundColor" | "textAlign" | "color",
  value: string
) => void;
