import { PointerEvent, useRef, useState } from "react";

type IHighlightCellProps = {
  cell: ICell;
  onDoubleClick: () => void;
  onPointerMove: (event: PointerEvent) => void;
};

const HighlightCell = ({
  cell: { height, width, x, y },
  onDoubleClick,
  onPointerMove,
}: IHighlightCellProps) => {
  const [pointerId, setPointerId] = useState<number | null>(null);

  const autoFillRef = useRef<HTMLSpanElement | null>(null);

  let left = `calc(${x}px - var(--col-width))`;
  let top = `calc(${y}px - var(--row-height))`;

  const handlePointerDown = ({
    nativeEvent: { pointerId },
  }: PointerEvent<HTMLSpanElement>) => {
    if (!autoFillRef.current) return;
    console.log("down");
    autoFillRef.current.setPointerCapture(pointerId);
    setPointerId(pointerId);
  };

  const handlePointerUp = () => {
    if (!autoFillRef.current || !pointerId) return;
    autoFillRef.current.releasePointerCapture(pointerId);
    setPointerId(null);
  };

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!pointerId) return;
    onPointerMove(event);
  };

  return (
    <div
      className="absolute flex text-sm bg-transparent border-2 border-blue p-1 z-10"
      style={{
        left,
        top,
        width: width,
        height: height,
      }}
      onDoubleClick={onDoubleClick}
    >
      <span
        ref={autoFillRef}
        className="absolute -bottom-[6px] -right-[6px] border border-white bg-dark-blue w-3 h-3 rounded-full cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      ></span>
    </div>
  );
};

export default HighlightCell;
