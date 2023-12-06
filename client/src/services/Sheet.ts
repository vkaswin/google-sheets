import axios from "./axios";
import { SHEET_URL } from "./config";

type ISheetData = {
  _id: string;
  title: string;
  grids: ISheetGrid[];
};

export const getSheetById = (sheetId: string) => {
  return axios<{ message: string; data: ISheetData }>({
    url: `${SHEET_URL}/${sheetId}/detail`,
    method: "get",
  });
};
