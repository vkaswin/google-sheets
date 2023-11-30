import { forwardRef } from "react";
import classNames from "classnames";

type IScrollBarProps = { axis: "x" | "y" };

const ScrollBar = forwardRef<HTMLDivElement, IScrollBarProps>(
  ({ axis }, ref) => {
    const isVertical = axis === "y";

    return (
      <div
        className={classNames(
          "absolute flex justify-centerbg-white border border-light-gray",
          isVertical
            ? "w-[var(--scrollbar-size)] h-[var(--grid-height)] right-0 top-[var(--scrollbar-top)]"
            : "h-[var(--scrollbar-size)] w-[var(--grid-width)] left-0 bottom-[var(--bottom-bar-height)]"
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
        ></div>
      </div>
    );
  }
);

export default ScrollBar;
