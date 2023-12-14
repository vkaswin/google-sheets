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

type IColumnDetail = { _id: string; columnId: number; width: number };

type IRowDetail = { _id: string; rowId: number; height: number };

type ICellDetail = ICellProps & Pick<ICell, "rowId" | "columnId">;

type ICellProps = {
  _id: string;
  text?: string;
  content?: any[];
  background?: string;
};

type IRowProps = {
  height?: number;
  backgroundColor?: string;
};

type IColumnProps = {
  width?: number;
  backgroundColor?: string;
};

type IRenderGrid = (data: {
  rowStart: number;
  colStart: number;
  offsetX?: number;
  offsetY?: number;
}) => void;

type IRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type IPaintCell = (ctx: CanvasRenderingContext2D, cell: ICell) => void;

type IPaintCells = (ctx: CanvasRenderingContext2D, cells: ICell[]) => void;

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
  size: string;
};

type IDirection = "top" | "bottom" | "left" | "right";

type IGrid = { rows: IRow[]; columns: IColumn[]; cells: ICell[] };

type IConfig = {
  lineWidth: number;
  strokeStyle: string;
  cellHeight: number;
  cellWidth: number;
  colWidth: number;
  defaultFont: string;
  defaultFontSize: string;
  scrollBarSize: number;
  scrollThumbSize: number;
  rowHeight: number;
  customFonts: string[];
  fonts: Record<string, string>;
  scale: number[];
  fontSizes: string[];
};

type ISheetGrid = {
  _id: string;
  title: string;
  color: string;
  sheetId: string;
};

type ISheetDetail = {
  _id: string;
  title: string;
  grids: ISheetGrid[];
};

type ISheetList = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;
}[];

type IAutoFillDetail = {
  srcCellId: string;
  destCellId?: string;
  rect: {
    width: number;
    height: number;
    translateX: number;
    translateY: number;
  };
};

type IPageMeta = {
  page: number;
  total: number;
  totalPages: number;
};

type IAutoFillData = {
  createCells: { rowId: number; columnId: number }[];
  updateCells: string[];
  cellId: string;
};

type IGridData = {
  grid: ISheetGrid;
  rows: IRowDetail[];
  columns: IColumnDetail[];
  cells: ICellDetail[];
};
