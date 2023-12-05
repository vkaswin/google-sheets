import axios from "./axios";
import { GRID_URL } from "./config";

type IGridData = {
  _id: string;
  title: string;
  color: string;
  sheetId: string;
  rows: IRowDetail[];
  columns: IColumnDetail[];
  cells: ICellDetail[];
};

export const getGridById = (gridId: string) => {
  return axios<{ message: string } & IGridData>({
    url: `${GRID_URL}/${gridId}/detail`,
    method: "get",
  });
};

export default { getGridById };
