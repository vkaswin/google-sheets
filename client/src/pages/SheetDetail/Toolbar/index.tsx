import { getStaticUrl } from "@/utils";
import { ChangeEvent } from "react";

let options = [
  {
    label: "File",
  },
  {
    label: "Edit",
  },
  {
    label: "View",
  },
  {
    label: "Insert",
  },
  {
    label: "Format",
  },
  {
    label: "Data",
  },
  {
    label: "Tools",
  },
  {
    label: "Extensions",
  },
  {
    label: "Help",
  },
];

const Toolbar = () => {
  const handleChange = (event: ChangeEvent<HTMLDivElement>) => {};

  return (
    <div className="bg-light-silver h-[var(--toolbar-height)]">
      <div className="flex items-center h-[65px]">
        <div className="flex items-center">
          <img className="w-[60px] h-[42px]" src={getStaticUrl("/logo.png")} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div
                className="text-dark-gray font-medium text-base border border-transparent px-1 outline-none rounded-sm hover:border-gray-500 focus:border-gray-500"
                contentEditable={true}
                onInput={handleChange}
                dangerouslySetInnerHTML={{ __html: "Untitled Spreadsheet" }}
              ></div>
              <i className="icon-star-outline"></i>
              <i className="icon-folder-move-outline"></i>
              <i className="icon-cloud-check-outline"></i>
            </div>
            <div className="flex gap-1">
              {options.map(({ label }, index) => {
                return (
                  <button
                    key={index}
                    className="px-2 bg-transparent transition-background duration-100 hover:bg-light-gray text-[15px] rounded"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className=""></div>
        {/* <i className="icon-history"></i>
        <i className="icon-comment-text-outline"></i>
        <i className="icon-lock-outline"></i>
        <img src="https://lh3.googleusercontent.com/ogw/AGvuzYbYUvEKxa6rFyPYlmSyOB0iLAYbAvNNCnB4PZS0fg=s32-c-mo" /> */}
      </div>
      <div className="flex items-center h-[45px] px-2 mx-[15px] rounded-full">
        Toolbar
      </div>
    </div>
  );
};

export default Toolbar;
