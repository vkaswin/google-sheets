export interface IRow {
  id: string;
  rowId: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IColumn {
  id: string;
  columnId: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ICell {
  id: string;
  x: number;
  y: number;
  rowId: string;
  columnId: string;
  width: number;
  height: number;
}

export interface ISheetMeta {
  totalRows: number;
  totalColumns: number;
}

export interface ICellProps {
  content?: string;
  backgroundColor?: string;
  color?: string;
}

export interface IRowProps {
  height?: number;
  backgroundColor?: string;
}

export interface IColumnProps {
  width?: number;
  backgroundColor?: string;
}

export interface ISheetDetail {
  meta: ISheetMeta;
  rows: Record<string, IRowProps>;
  columns: Record<string, IColumnProps>;
  cells: Record<string, ICellProps>;
}

export type IRenderGrid = (data: {
  offsetX: number;
  offsetY: number;
  rowStart: number;
  colStart: number;
}) => void;
