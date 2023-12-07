import { MutableRefObject, PointerEvent, useRef, useState } from "react";

type IHighlightCellProps = {
  cell: ICell;
  gridRef: MutableRefObject<HTMLDivElement | null>;
};

const HighlightCell = ({
  cell: { height, width, x, y },
  gridRef,
}: IHighlightCellProps) => {
  const [pointerId, setPointerId] = useState<number | null>(null);

  const autoFillRef = useRef<HTMLSpanElement | null>(null);

  const handlePointerDown = ({
    nativeEvent: { pointerId },
  }: PointerEvent<HTMLSpanElement>) => {
    if (!autoFillRef.current) return;
    autoFillRef.current.setPointerCapture(pointerId);
    setPointerId(pointerId);
  };

  const handlePointerUp = () => {
    if (!autoFillRef.current || !pointerId) return;
    autoFillRef.current.releasePointerCapture(pointerId);
    setPointerId(null);
  };

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!pointerId || !gridRef.current) return;

    let { pageX, pageY } = event;

    let { left, top } = gridRef.current.getBoundingClientRect();

    pageX = pageX - left;
    pageY = pageY - top;

    console.log(pageX, pageY);
  };

  let left = `calc(${x}px - var(--col-width))`;
  let top = `calc(${y}px - var(--row-height))`;

  return (
    <div className="absolute z-10">
      <div
        className="absolute border-t-2 border-blue"
        style={{
          width,
          left: `calc(${x}px - var(--col-width))`,
          top: `calc(${y}px - var(--row-height))`,
        }}
      ></div>
      <div
        className="absolute border-b-2 border-blue"
        style={{
          width,
          left: `calc(${x}px - var(--col-width))`,
          top: `calc(${y + height}px - var(--row-height))`,
        }}
      ></div>
      <div
        className="absolute border-l-2 border-blue"
        style={{
          height,
          left: `calc(${x}px - var(--col-width))`,
          top: `calc(${y}px - var(--row-height))`,
        }}
      ></div>
      <div
        className="absolute border-r-2 border-blue"
        style={{
          height,
          left: `calc(${x + width}px - var(--col-width))`,
          top: `calc(${y}px - var(--row-height))`,
        }}
      ></div>
      <span
        ref={autoFillRef}
        className="absolute -translate-x-[6px] -translate-y-[6px] border border-white bg-dark-blue w-3 h-3 rounded-full cursor-crosshair"
        style={{
          left: `calc(${x + width}px - var(--col-width))`,
          top: `calc(${y + height}px - var(--row-height))`,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      ></span>
      <div
        className="absolute border-dashed border-black"
        style={{ width, height, top, left }}
      ></div>
    </div>
  );
};

export default HighlightCell;
