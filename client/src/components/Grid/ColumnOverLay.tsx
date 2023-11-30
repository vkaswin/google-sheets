type IColumnOverLay = {
  selectedColumn: IColumn;
};

const ColumnOverLay = ({ selectedColumn }: IColumnOverLay) => {
  let { width, x } = selectedColumn;
  let left = `calc(${x}px - var(--col-width))`;

  return (
    <div
      className="absolute top-[var(--col-height)] left-0 w-[var(--col-width)] border-dark-blue border-r border-l bg-light-sky-blue h-full"
      style={{ width, left }}
    ></div>
  );
};

export default ColumnOverLay;
