import classNames from "classnames";

type IHighlightCellProps = {
  cell: ICell;
  dashed?: boolean;
};

const HighLightCell = ({ cell, dashed = false }: IHighlightCellProps) => {
  return (
    <div className={classNames("absolute", dashed ? "z-20" : "z-10")}>
      <div
        className={classNames("absolute border-t-2 border-blue", {
          "border-dashed": dashed,
        })}
        style={{
          width: cell.width,
          left: `calc(${cell.x}px - var(--col-width))`,
          top: `calc(${cell.y}px - var(--row-height))`,
        }}
      ></div>
      <div
        className={classNames("absolute border-b-2 border-blue", {
          "border-dashed": dashed,
        })}
        style={{
          width: cell.width,
          left: `calc(${cell.x}px - var(--col-width))`,
          top: `calc(${cell.y + cell.height}px - var(--row-height))`,
        }}
      ></div>
      <div
        className={classNames("absolute border-l-2 border-blue", {
          "border-dashed": dashed,
        })}
        style={{
          height: cell.height,
          left: `calc(${cell.x}px - var(--col-width))`,
          top: `calc(${cell.y}px - var(--row-height))`,
        }}
      ></div>
      <div
        className={classNames("absolute border-r-2 border-blue", {
          "border-dashed": dashed,
        })}
        style={{
          height: cell.height,
          left: `calc(${cell.x + cell.width}px - var(--col-width))`,
          top: `calc(${cell.y}px - var(--row-height))`,
        }}
      ></div>
    </div>
  );
};

export default HighLightCell;
