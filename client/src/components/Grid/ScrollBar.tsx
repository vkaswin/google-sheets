import {
  forwardRef,
  useState,
  PointerEvent,
  MutableRefObject,
  useRef,
} from "react";
import classNames from "classnames";

type IScrollBarProps = { axis: "x" | "y"; onScroll: (delta: number) => void };

const ScrollBar = forwardRef<HTMLDivElement, IScrollBarProps>(
  ({ axis, onScroll }, ref) => {
    const [pointerId, setPointerId] = useState<number | null>(null);

    const scrollPosition = useRef({
      curr: { x: 0, y: 0 },
      prev: { x: 0, y: 0 },
    });

    const isVertical = axis === "y";

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
      let { target, pointerId, pageX, pageY } = event;
      (target as HTMLElement).setPointerCapture(pointerId);
      scrollPosition.current.curr.x = pageX;
      scrollPosition.current.curr.y = pageY;
      setPointerId(pointerId);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
      if (!pointerId) return;

      let { pageX, pageY } = event;

      scrollPosition.current.prev.x = scrollPosition.current.curr.x;
      scrollPosition.current.prev.y = scrollPosition.current.curr.y;

      scrollPosition.current.curr.x = pageX;
      scrollPosition.current.curr.y = pageY;

      let delta;

      if (isVertical)
        delta = scrollPosition.current.curr.y - scrollPosition.current.prev.y;
      else
        delta = scrollPosition.current.curr.x - scrollPosition.current.prev.x;

      onScroll(delta);
    };

    const handlePointerUp = () => {
      if (!pointerId) return;
      let ele = ref as MutableRefObject<HTMLDivElement>;
      if (ele) ele.current.releasePointerCapture(pointerId);
      setPointerId(null);
    };

    return (
      <div
        className={classNames(
          "absolute flex justify-center bg-white border border-light-gray z-50",
          isVertical
            ? "w-[var(--scrollbar-size)] h-[calc(100%-var(--scrollbar-size))] right-0 top-0"
            : "h-[var(--scrollbar-size)] w-[calc(100%-var(--scrollbar-size))] left-0 bottom-0"
        )}
      >
        <div
          ref={ref}
          className={classNames(
            "absolute  bg-light-gray rounded-full cursor-pointer",
            isVertical
              ? "left-1/2 -translate-x-1/2 w-[90%] h-[var(--scrollbar-thumb-size)]"
              : "top-1/2 -translate-y-1/2 w-[var(--scrollbar-thumb-size)] h-[90%]"
          )}
          style={isVertical ? { top: "0px" } : { left: "0px" }}
          onPointerDown={handlePointerDown}
          onPointerMoveCapture={handlePointerMove}
          onPointerUp={handlePointerUp}
        ></div>
      </div>
    );
  }
);

export default ScrollBar;
