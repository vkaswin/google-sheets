import axios from "./axios";
import { CELL_URL } from "./config";

export const createCell = (gridId: string, data: Partial<ICellDetail>) => {
  return axios<{ message: string; data: { cellId: string } }>({
    url: `${CELL_URL}/${gridId}/create`,
    method: "post",
    data,
  });
};

export const updateCellById = (cellId: string, data: Partial<ICellDetail>) => {
  return axios<{ message: string }>({
    url: `${CELL_URL}/${cellId}/update`,
    method: "put",
    data,
  });
};

export const duplicateCells = (gridId: string, data: IAutoFillData) => {
  return axios<{ message: string; data: { cells: ICellDetail[] } }>({
    url: `${CELL_URL}/${gridId}/duplicate`,
    method: "post",
    data,
  });
};

export const copyPasteCell = (
  cellId: string,
  data: { rowId: number; columnId: number }
) => {
  return axios<{ message: string; data: { cell: ICellDetail } }>({
    url: `${CELL_URL}/${cellId}/copypaste`,
    method: "post",
    data,
  });
};
