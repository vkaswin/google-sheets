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

type IColumnDetail = { columnId: number; width: number };

type IRowDetail = { rowId: number; height: number };

type ICellDetail = ICellProps & Pick<ICell, "rowId" | "columnId">;

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
  cells: ({ _id: string; rowId: number; columnId: number } & ICellProps)[];
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

type IDirection = "top" | "bottom" | "left" | "right";

type IGrid = { rows: IRow[]; columns: IColumn[]; cells: ICell[] };

type IConfig = {
  lineWidth: number;
  strokeStyle: string;
  cellHeight: number;
  cellWidth: number;
  colWidth: number;
  rowHeight: number;
  customFonts: string[];
  fonts: Record<string, string>;
};

type ISubSheetMetaData = {
  _id: string;
  title: string;
  color: string;
};

type ISheetMetaData = {
  _id: string;
  title: string;
  sheets: ISubSheetMetaData[];
};
