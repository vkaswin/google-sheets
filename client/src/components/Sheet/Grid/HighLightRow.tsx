type IHighLightRowProps = {
  row: IRow;
};

const HighLightRow = ({
  row: { height, rowId, width, x, y },
}: IHighLightRowProps) => {
  let top = `calc(${y}px - var(--row-height))`;

  return (
    <div className="absolute left-0 top-[var(--row-height)] w-[var(--col-width)] h-[calc(100%-var(--row-height))] overflow-hidden z-10">
      <div
        className="absolute flex justify-center items-center bg-dark-blue"
        style={{ left: x, top, width, height }}
      >
        <span className="text-white text-xs font-medium">{rowId}</span>
      </div>
    </div>
  );
};

export default HighLightRow;
