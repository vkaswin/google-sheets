import { MutableRefObject, PointerEvent, useRef, useState } from "react";

type IHighlightCellProps = {
  cells: ICell[];
  selectedCell: ICell;
  gridRef: MutableRefObject<HTMLDivElement | null>;
  onAutoFillCell: (start: number[], end: number[], cellId: string) => void;
  getCellIdByCoordiantes: (x: number, y: number) => string | null;
};

const HighlightCell = ({
  cells,
  gridRef,
  selectedCell,
  onAutoFillCell,
  getCellIdByCoordiantes,
}: IHighlightCellProps) => {
  const [pointerId, setPointerId] = useState<number | null>(null);

  const [autoFillDetail, setAutoFillDetail] = useState<IAutoFillDetail | null>(
    null
  );

  const autoFillRef = useRef<HTMLSpanElement | null>(null);

  const handlePointerDown = ({
    nativeEvent: { pointerId },
  }: PointerEvent<HTMLSpanElement>) => {
    if (!autoFillRef.current) return;
    autoFillRef.current.setPointerCapture(pointerId);
    setPointerId(pointerId);
    setAutoFillDetail({
      srcCellId: selectedCell.cellId,
      rect: {
        width: selectedCell.width,
        height: selectedCell.height,
        transform: "translate(0px,0px)",
      },
    });
  };

  const handleAutoFillCell = () => {
    if (!autoFillDetail || !autoFillDetail.destCellId) return;

    let order = autoFillDetail.srcCellId.localeCompare(
      autoFillDetail.destCellId
    );

    if (!order) return;

    let start: number[];
    let end: number[];

    let dest = autoFillDetail.destCellId.split(",").map((id) => +id);
    let src = autoFillDetail.srcCellId.split(",").map((id) => +id);

    start = order > 0 ? [dest[0], src[1]] : src;
    end = order > 0 ? [src[0], dest[1]] : dest;

    console.log(autoFillDetail);

    // onAutoFillCell(start, end, autoFillDetail.srcCellId);
  };

  const handlePointerUp = () => {
    if (!autoFillRef.current || !pointerId) return;
    autoFillRef.current.releasePointerCapture(pointerId);
    handleAutoFillCell();
    setPointerId(null);
    setAutoFillDetail(null);
  };

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!pointerId || !gridRef.current || !autoFillDetail) return;

    let { pageX, pageY } = event;

    let { left, top } = gridRef.current.getBoundingClientRect();

    pageX = pageX - left;
    pageY = pageY - top;

    let cellId = getCellIdByCoordiantes(pageX, pageY);

    if (!cellId) return;

    let cellData = cells.find((cell) => cell.cellId === cellId);

    if (!cellData) return;

    let x = pageX - selectedCell.x;
    let y = pageY - selectedCell.y;

    let width = 0;
    let height = 0;
    let translateX = 0;
    let translateY = 0;

    if (x < 0) translateX = -(selectedCell.x - cellData.x);

    if (y < 0) translateY = -(selectedCell.y - cellData.y);

    if (cellId !== selectedCell.cellId) {
      if (cellData.x > selectedCell.x)
        width = cellData.x + cellData.width - selectedCell.x;
      else width = selectedCell.x + selectedCell.width - cellData.x;

      if (cellData.y > selectedCell.y)
        height = cellData.y + cellData.height - selectedCell.y;
      else height = selectedCell.y + selectedCell.height - cellData.y;
    } else {
      width = selectedCell.width;
      height = selectedCell.height;
    }

    setAutoFillDetail({
      ...autoFillDetail,
      destCellId: cellId,
      rect: {
        width,
        height,
        transform: `translate(${translateX}px,${translateY}px)`,
      },
    });
  };

  return (
    <div className="absolute z-10">
      <div
        className="absolute border-t-2 border-blue"
        style={{
          width: selectedCell.width,
          left: `calc(${selectedCell.x}px - var(--col-width))`,
          top: `calc(${selectedCell.y}px - var(--row-height))`,
        }}
      ></div>
      <div
        className="absolute border-b-2 border-blue"
        style={{
          width: selectedCell.width,
          left: `calc(${selectedCell.x}px - var(--col-width))`,
          top: `calc(${
            selectedCell.y + selectedCell.height
          }px - var(--row-height))`,
        }}
      ></div>
      <div
        className="absolute border-l-2 border-blue"
        style={{
          height: selectedCell.height,
          left: `calc(${selectedCell.x}px - var(--col-width))`,
          top: `calc(${selectedCell.y}px - var(--row-height))`,
        }}
      ></div>
      <div
        className="absolute border-r-2 border-blue"
        style={{
          height: selectedCell.height,
          left: `calc(${
            selectedCell.x + selectedCell.width
          }px - var(--col-width))`,
          top: `calc(${selectedCell.y}px - var(--row-height))`,
        }}
      ></div>
      <span
        ref={autoFillRef}
        className="absolute -translate-x-[6px] -translate-y-[6px] border border-white bg-dark-blue w-3 h-3 rounded-full cursor-crosshair"
        style={{
          left: `calc(${
            selectedCell.x + selectedCell.width
          }px - var(--col-width))`,
          top: `calc(${
            selectedCell.y + selectedCell.height
          }px - var(--row-height))`,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      ></span>
      {autoFillDetail && (
        <div
          className="absolute border border-dashed border-black"
          style={{
            ...autoFillDetail.rect,
            left: `calc(${selectedCell.x}px - var(--col-width))`,
            top: `calc(${selectedCell.y}px - var(--row-height))`,
          }}
        ></div>
      )}
    </div>
  );
};

export default HighlightCell;
