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

export const updateSheetById = (
  sheetId: string,
  data: Partial<ISheetDetail>
) => {
  return axios({
    url: `${SHEET_URL}/${sheetId}/update`,
    method: "put",
    data,
  });
};

export const getSheetList = (params: {
  limit: number;
  search: string;
  page: number;
}) => {
  return axios<{
    message: string;
    data: { sheets: ISheetList; pageMeta: IPageMeta };
  }>({
    url: `${SHEET_URL}/list`,
    method: "get",
    params,
  });
};

export const removeSheetById = (sheetId: string) => {
  return axios<{ message: string }>({
    url: `${SHEET_URL}/${sheetId}/remove`,
    method: "delete",
  });
};

export const createSheet = () => {
  return axios<{ message: string; data: { sheetId: string } }>({
    url: `${SHEET_URL}/create`,
    method: "post",
  });
};
