import { ChangeEvent } from "react";
import { debounce } from "@/utils";

type ISearchBox = {
  count: number;
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSearch: (val: string) => void;
  onClose: () => void;
};

const SeachBox = ({
  count,
  activeIndex,
  onPrevious,
  onNext,
  onSearch,
  onClose,
}: ISearchBox) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="fixed flex items-center gap-2 top-6 right-6 border border-mild-gray rounded-md px-4 py-5">
      <div className="relative w-44 h-9">
        <input
          placeholder="Find in sheet"
          className="w-full h-full outline-dark-blue border border-mild-gray text-sm rounded px-2 py-2 pr-14"
          onChange={debounce(handleChange, 500)}
          autoFocus
        />
        {count > 0 && (
          <span className="absolute flex top-1/2 -translate-y-1/2 right-3 text-xs text-light-gray">
            {activeIndex + 1} of {count}
          </span>
        )}
      </div>
      <button
        className="text-gray-400 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!count}
      >
        <i className="bx-chevron-up" onClick={onPrevious}></i>
      </button>
      <button
        className="text-gray-400 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!count}
      >
        <i className="bx-chevron-down " onClick={onNext}></i>
      </button>
      <button className="text-xl text-dark-gray">
        <i className="bx-x" onClick={onClose}></i>
      </button>
    </div>
  );
};

export default SeachBox;
