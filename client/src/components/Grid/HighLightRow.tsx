type IHighLightRowProps = {
  scale: number;
  row: IRow;
};

const HighLightRow = ({
  scale,
  row: { height, rowId, width, x, y },
}: IHighLightRowProps) => {
  let top = `calc(${y}px - var(--row-height))`;

  return (
    <div className="absolute left-0 top-[var(--row-height)] w-[var(--col-width)] h-[calc(100%-var(--row-height))] overflow-hidden z-10">
      <div
        className="absolute flex justify-center items-center bg-dark-blue"
        style={{ left: x, top, width, height }}
      >
        <span
          className="text-white font-medium"
          style={{ fontSize: `${12 * scale}px` }}
        >
          {rowId}
        </span>
      </div>
    </div>
  );
};

export default HighLightRow;
