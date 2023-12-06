type IROwOverLayProps = {
  row: IRow;
};

const RowOverLay = ({ row: { height, y } }: IROwOverLayProps) => {
  let top = `calc(${y}px - var(--row-height))`;

  return (
    <div
      className="absolute top-[var(--col-height)] left-0 w-full border-dark-blue border-t border-b bg-light-sky-blue"
      style={{ height, top }}
    ></div>
  );
};

export default RowOverLay;
