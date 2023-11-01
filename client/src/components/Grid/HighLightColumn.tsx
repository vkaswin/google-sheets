import { convertToTitle } from "@/utils";

import { IColumn } from "@/types/Sheets";
import { Fragment } from "react";

type IHighLightColumn = {
  selectedColumn: IColumn;
};

const HighLightColumn = ({ selectedColumn }: IHighLightColumn) => {
  const { columnId, height, width, x, y } = selectedColumn;
  return (
    <div
      className="absolute flex justify-center items-center bg-dark-blue"
      style={{ left: x, top: y, width, height }}
    >
      <span className="text-white text-xs font-medium">
        {convertToTitle(columnId)}
      </span>
    </div>
  );
};

export default HighLightColumn;
