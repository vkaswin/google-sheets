import { forwardRef } from "react";
import classNames from "classnames";

type IScrollBarProps = { axis: "x" | "y" };

const ScrollBar = forwardRef<HTMLDivElement, IScrollBarProps>(
  ({ axis }, ref) => {
    const isVertical = axis === "y";

    return (
      <div
        className={classNames(
          "absolute flex justify-center bg-white border border-light-gray z-10",
          isVertical
            ? "w-[var(--scrollbar-size)] h-[calc(100%-var(--scrollbar-size))] right-0 top-0"
            : "h-[var(--scrollbar-size)] w-[calc(100%-var(--scrollbar-size))] left-0 bottom-0"
        )}
      >
        <div
          ref={ref}
          className={classNames(
            "absolute  bg-light-gray rounded-full",
            isVertical
              ? "left-1/2 -translate-x-1/2 w-[90%] h-12"
              : "top-1/2 -translate-y-1/2 w-12 h-[90%]"
          )}
          style={isVertical ? { top: "0px" } : { left: "0px" }}
        ></div>
      </div>
    );
  }
);

export default ScrollBar;
