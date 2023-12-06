import axios from "./axios";
import { ROW_URL } from "./config";

export const createRow = (gridId: string, data: Partial<IRowDetail>) => {
  return axios<{ message: string; data: { rowId: string } }>({
    url: `${ROW_URL}/${gridId}/create`,
    method: "post",
    data,
  });
};

export const updateRowById = (rowId: string, data: Partial<IRowDetail>) => {
  return axios<{ message: string }>({
    url: `${ROW_URL}/${rowId}/update`,
    method: "put",
    data,
  });
};
