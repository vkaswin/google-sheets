import {
  PointerEvent as PointerEventReact,
  useEffect,
  useRef,
  useState,
} from "react";

type IHighlightCellProps = {
  cell: ICell;
  onPointerMove: (event: PointerEvent) => void;
};

const HighlightCell = ({
  cell: { height, width, x, y },
  onPointerMove,
}: IHighlightCellProps) => {
  const [pointerId, setPointerId] = useState<number | null>(null);

  const autoFillRef = useRef<HTMLSpanElement | null>(null);

  let left = `calc(${x}px - var(--col-width))`;
  let top = `calc(${y}px - var(--row-height))`;

  useEffect(() => {
    if (!pointerId) return;

    const handlePointerMove = (event: PointerEvent) => {
      onPointerMove(event);
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [pointerId]);

  const handlePointerDown = ({
    nativeEvent: { pointerId },
  }: PointerEventReact<HTMLSpanElement>) => {
    if (!autoFillRef.current) return;
    autoFillRef.current.setPointerCapture(pointerId);
    setPointerId(pointerId);
  };

  const handlePointerUp = () => {
    if (!autoFillRef.current || !pointerId) return;
    autoFillRef.current.releasePointerCapture(pointerId);
    setPointerId(null);
  };

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
        onClick={(e) => {
          console.log(e);
          e.stopPropagation();
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      ></span>
    </div>
  );
};

export default HighlightCell;
