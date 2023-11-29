type IColumnOverLay = {
  selectedColumn: IColumn;
};

const ColumnOverLay = ({ selectedColumn }: IColumnOverLay) => {
  let { columnId, height, width, x, y } = selectedColumn;
  let left = `calc(${x}px - var(--col-width))`;
  let top = `calc(${y}px - var(--row-height))`;
  return (
    <div
      className="absolute top-[var(--col-height)] left-0 w-[var(--col-width)] border-dark-blue border-r border-l bg-light-sky-blue h-full"
      style={{ width, left, top }}
    ></div>
  );
};

export default ColumnOverLay;
