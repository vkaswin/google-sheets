import axios from "./axios";
import { SHEET_URL } from "./config";

type ISheetData = {
  _id: string;
  title: string;
  rows: IRowDetail[];
  columns: IColumnDetail[];
  cells: ICellDetail[];
  grids: ISheetGrid[];
};

export const getSheetById = (sheetId: string, gridId: string | null) => {
  return axios<{ message: string } & ISheetData>({
    url: `${SHEET_URL}/${sheetId}/detail`,
    params: { gridId },
    method: "get",
  });
};
