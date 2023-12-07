import {
  PointerEvent as PointerEventReact,
  useEffect,
  useRef,
  useState,
} from "react";

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
        onPointerUp={handlePointerUp}
      ></span>
    </div>
  );
};

export default HighlightCell;
