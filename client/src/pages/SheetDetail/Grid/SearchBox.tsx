import { ChangeEvent, useEffect, useState } from "react";
import { debounce } from "@/utils";

type ISearchBox = {
  count: number;
  onPrevious: () => void;
  onNext: () => void;
  onSearch: (val: string) => void;
  onClose: () => void;
};

const SeachBox = ({
  count,
  onPrevious,
  onNext,
  onSearch,
  onClose,
}: ISearchBox) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="fixed flex items-center gap-2 top-6 right-6 border border-mild-gray rounded-md w-72 px-4 py-5">
      <input
        placeholder="Find in sheet"
        className="w-44 h-9 outline-dark-blue border border-mild-gray text-sm rounded px-2 py-2"
        onChange={debounce(handleChange, 500)}
      />
      <button
        className="text-gray-400 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!count}
      >
        <i className="bx-chevron-up" onClick={onNext}></i>
      </button>
      <button
        className="text-gray-400 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!count}
      >
        <i className="bx-chevron-down " onClick={onPrevious}></i>
      </button>
      <button className="text-xl text-dark-gray">
        <i className="bx-x" onClick={onClose}></i>
      </button>
    </div>
  );
};

export default SeachBox;
