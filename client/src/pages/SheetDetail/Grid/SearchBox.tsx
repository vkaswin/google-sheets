import { ChangeEvent, Fragment, useEffect, useMemo, useState } from "react";
import { debounce } from "@/utils";

import { ICell } from "@/types/Sheets";
import classNames from "classnames";

type ISearchBox = {
  cells: ICell[];
};

const SeachBox = ({ cells }: ISearchBox) => {
  let [isOpen, setIsOpen] = useState(true);

  let [activeIndex, setActiveIndex] = useState(0);

  const [cellIds, setCellIds] = useState<string[]>([]);

  let highLightCellIds = useMemo(() => new Set(cellIds), [cellIds]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (event: Event) => {
    let { ctrlKey, key } = event as KeyboardEvent;

    if (ctrlKey && key === "f" && !isOpen) {
      event.preventDefault();
      toggle();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    let result = ["1,1", "2,5", "4,5", "5,1", "2,2"];
    setCellIds(result);
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNext = () => {
    setActiveIndex((activeIndex) => {
      activeIndex++;
      return activeIndex === cellIds.length ? 0 : activeIndex;
    });
  };

  const handlePrevious = () => {
    setActiveIndex((activeIndex) => {
      activeIndex--;
      return activeIndex < 0 ? cellIds.length - 1 : activeIndex;
    });
  };

  if (!isOpen) return null;

  return (
    <Fragment>
      <div className="fixed flex items-center gap-2 top-6 right-6 border border-mild-gray rounded-md w-72 px-4 py-5">
        <input
          placeholder="Find in sheet"
          className="w-44 h-9 outline-dark-blue border border-mild-gray text-sm rounded px-2 py-2"
          onChange={debounce(handleChange, 500)}
        />
        <button
          className="text-gray-400 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!cellIds.length}
        >
          <i className="bx-chevron-up" onClick={handlePrevious}></i>
        </button>
        <button
          className="text-gray-400 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!cellIds.length}
        >
          <i className="bx-chevron-down " onClick={handleNext}></i>
        </button>
        <button className="text-xl text-dark-gray">
          <i className="bx-x" onClick={toggle}></i>
        </button>
      </div>
      {cells.map(({ cellId, columnId, height, rowId, width, x, y }) => {
        if (!highLightCellIds.has(cellId)) return null;

        let left = `calc(${x}px - var(--col-width))`;
        let top = `calc(${y}px - var(--row-height))`;

        return (
          <div
            key={cellId}
            className={classNames(
              "absolute",
              cellId === cellIds[activeIndex]
                ? "bg-[rgba(55,190,95,.702)] shadow-[0_0_0_2px_#146c2e] border border-white"
                : "bg-[rgba(109,213,140,.4)]"
            )}
            style={{
              width,
              height,
              left: x,
              top: y,
            }}
          ></div>
        );
      })}
    </Fragment>
  );
};

export default SeachBox;
