import axios from "./axios";
import { GRID_URL } from "./config";

type IGridData = {
  grid: ISheetGrid;
  rows: IRowDetail[];
  columns: IColumnDetail[];
  cells: ICellDetail[];
};

export const getGridById = (gridId: string) => {
  return axios<{ message: string; data: IGridData }>({
    url: `${GRID_URL}/${gridId}/detail`,
    method: "get",
  });
};

export const createGrid = (sheetId: string) => {
  return axios<{ message: string; data: ISheetGrid }>({
    url: `${GRID_URL}/${sheetId}/create`,
    method: "post",
  });
};

export const searchGrid = (gridId: string, q: string) => {
  return axios<{ message: string; data: { cells: string[] } }>({
    url: `${GRID_URL}/${gridId}/search`,
    method: "get",
    params: { q },
  });
};
