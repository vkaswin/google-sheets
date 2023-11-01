import { IRow } from "@/types/Sheets";

type IHighLightRow = {
  selectedRow: IRow;
};

const HighLightRow = ({ selectedRow }: IHighLightRow) => {
  const { height, rowId, width, x, y } = selectedRow;

  return (
    <div
      className="absolute flex justify-center items-center bg-dark-blue"
      style={{ left: x, top: y, width, height }}
    >
      <span className="text-white text-xs font-medium">{rowId}</span>
    </div>
  );
};

export default HighLightRow;
