import { Fragment } from "react";
import { convertToTitle } from "@/utils";

import { IColumn } from "@/types/Sheets";

type IHighlightColumn = {
  selectedColumn: IColumn;
};

const HighLightColumn = ({ selectedColumn }: IHighlightColumn) => {
  let { columnId, height, width, x, y } = selectedColumn;
  let left = `calc(${x}px - var(--col-width))`;
  let top = `calc(${y}px - var(--row-height))`;
  return (
    <Fragment>
      <div
        className="absolute flex justify-center items-center bg-dark-blue"
        style={{ width, height, left: x, top: y }}
      >
        <span className="text-white text-xs">{convertToTitle(columnId)}</span>
      </div>
      <div
        className="absolute top-[var(--col-height)] left-0 w-[var(--col-width)] border-dark-blue border-r border-l bg-light-sky-blue h-full"
        style={{ width, left: x, top: y }}
      ></div>
    </Fragment>
  );
};

export default HighLightColumn;
