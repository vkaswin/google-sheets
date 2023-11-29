import { Fragment, forwardRef } from "react";

type IScrollBarProps = { axis: "x" | "y" };

const ScrollBar = forwardRef<HTMLDivElement, IScrollBarProps>(
  ({ axis }, ref) => {
    return (
      <Fragment>
        {axis === "x" ? (
          <div className="absolute flex justify-center w-[var(--scrollbar-size)] h-[var(--grid-height)] right-0 top-[var(--scrollbar-top)] bg-white border border-light-gray">
            <div
              ref={ref}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-light-gray rounded-full"
            ></div>
          </div>
        ) : (
          <div className="absolute flex justify-center h-[var(--scrollbar-size)] w-[var(--grid-width)] left-0 bottom-[var(--bottom-bar-height)] bg-white border border-light-gray">
            <div
              ref={ref}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-12 h-[90%] bg-light-gray rounded-full"
            ></div>
          </div>
        )}
      </Fragment>
    );
  }
);

export default ScrollBar;
