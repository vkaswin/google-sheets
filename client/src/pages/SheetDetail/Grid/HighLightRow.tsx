import { Fragment } from "react";

import { IRow } from "@/types/Sheets";

type IHighLightRow = {
  selectedRow: IRow;
};

const HighLightRow = ({ selectedRow }: IHighLightRow) => {
  let { rowId, height, width, x, y } = selectedRow;
  return (
    <Fragment>
      <div
        className="absolute flex justify-center items-center bg-dark-blue"
        style={{ width, height, left: x, top: y }}
      >
        <span className="text-white text-xs">{rowId}</span>
      </div>
      <div
        className="absolute top-[var(--col-height)] left-0 w-full border-dark-blue border-t border-b bg-light-sky-blue"
        style={{ height, left: x, top: y }}
      ></div>
    </Fragment>
  );
};

export default HighLightRow;
