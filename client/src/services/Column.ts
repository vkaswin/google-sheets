import axios from "./axios";
import { COLUMN_URL } from "./config";

export const createColumn = (gridId: string, data: Partial<IColumnDetail>) => {
  return axios<{ message: string; data: { columnId: string } }>({
    url: `${COLUMN_URL}/${gridId}/create`,
    method: "post",
    data,
  });
};

export const updateColumnById = (
  columnId: string,
  data: Partial<IColumnDetail>
) => {
  return axios<{ message: string }>({
    url: `${COLUMN_URL}/${columnId}/update`,
    method: "put",
    data,
  });
};
