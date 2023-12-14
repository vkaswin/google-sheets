import { useState, useRef, PointerEvent, MutableRefObject } from "react";

type IAutoFillProps = {
  cells: ICell[];
  gridRef: MutableRefObject<HTMLDivElement | null>;
  selectedCell: ICell;
  onAutoFillCell: (data: IAutoFillData) => void;
  getCellById: (cellId?: string) => ICellDetail | undefined;
  getCellIdByCoordiantes: (x: number, y: number) => string | null;
};

const AutoFill = ({
  gridRef,
  cells,
  selectedCell,
  getCellById,
  onAutoFillCell,
  getCellIdByCoordiantes,
}: IAutoFillProps) => {
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
        translateX: 0,
        translateY: 0,
      },
    });
  };

  const handleAutoFillCell = () => {
    if (
      !autoFillDetail ||
      !autoFillDetail.destCellId ||
      selectedCell.cellId === autoFillDetail.destCellId
    )
      return;

    let { translateX, translateY } = autoFillDetail.rect;

    let src = autoFillDetail.srcCellId.split(",").map((id) => +id);
    let dest = autoFillDetail.destCellId.split(",").map((id) => +id);

    let createCells: { rowId: number; columnId: number }[] = [];
    let updateCells: string[] = [];
    let rowStart, rowEnd, colStart, colEnd;

    if (translateX >= 0 && translateY >= 0) {
      rowStart = src[1];
      rowEnd = dest[1];
      colStart = src[0];
      colEnd = dest[0];
    } else if (translateX < 0 && translateY < 0) {
      colStart = dest[0];
      colEnd = src[0];
      rowStart = dest[1];
      rowEnd = src[1];
    } else if (translateX < 0 && translateY === 0) {
      rowStart = src[1];
      rowEnd = dest[1];
      colStart = dest[0];
      colEnd = src[0];
    } else if (translateX === 0 && translateY < 0) {
      colStart = src[0];
      colEnd = dest[0];
      rowStart = dest[1];
      rowEnd = src[1];
    }

    if (
      typeof colStart !== "number" ||
      typeof colEnd !== "number" ||
      typeof rowStart !== "number" ||
      typeof rowEnd !== "number"
    )
      return;

    for (let columnId = colStart; columnId <= colEnd; columnId++) {
      for (let rowId = rowStart; rowId <= rowEnd; rowId++) {
        let cellId = `${columnId},${rowId}`;
        if (cellId === selectedCell.cellId) continue;
        let cellData = getCellById(cellId);
        if (cellData) updateCells.push(cellData._id);
        else createCells.push({ rowId, columnId });
      }
    }

    if (!updateCells.length && !createCells.length) return;

    let cellData = getCellById(autoFillDetail.srcCellId);

    if (!cellData) return;

    onAutoFillCell({
      updateCells,
      createCells,
      cellId: cellData._id,
    });
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

    let { left, top } = gridRef.current.getBoundingClientRect();

    let pageX = event.pageX - left;
    let pageY = event.pageY - top;

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
        translateX,
        translateY,
      },
    });
  };

  return (
    <div className="absolute z-10">
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
            width: autoFillDetail.rect.width,
            height: autoFillDetail.rect.height,
            transform: `translate(${autoFillDetail.rect.translateX}px,${autoFillDetail.rect.translateY}px)`,
            left: `calc(${selectedCell.x}px - var(--col-width))`,
            top: `calc(${selectedCell.y}px - var(--row-height))`,
          }}
        ></div>
      )}
    </div>
  );
};

export default AutoFill;
