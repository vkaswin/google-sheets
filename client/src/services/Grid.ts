import axios from "./axios";
import { GRID_URL } from "./config";

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

export const removeGridById = (gridId: string) => {
  return axios<{ message: string }>({
    url: `${GRID_URL}/${gridId}/remove`,
    method: "delete",
  });
};

export const updateGridById = (gridId: string, data: Partial<ISheetGrid>) => {
  return axios<{ message: string }>({
    url: `${GRID_URL}/${gridId}/update`,
    method: "put",
    data,
  });
};

export const duplicateGridById = (gridId: string) => {
  return axios<{ message: string; data: { grid: ISheetGrid } }>({
    url: `${GRID_URL}/${gridId}/duplicate`,
    method: "post",
  });
};
