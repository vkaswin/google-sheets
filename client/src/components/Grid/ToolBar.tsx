import { Fragment, MouseEvent, useState } from "react";
import ColorPicker from "./ColorPicker";

type IToolBarProps = {
  onFormatText: (type: IFormatTypes) => void;
};

const ToolBar = ({ onFormatText }: IToolBarProps) => {
  const [colorPicker, setColorPicker] = useState<{
    rect: DOMRect;
    type: "backgroundColor" | "color" | "border";
  } | null>(null);

  const handleSelectColor = (colorCode: string) => {
    console.log(colorCode);
    handleCloseColorPicker();
  };

  const handleCloseColorPicker = () => {
    setColorPicker(null);
  };

  const handleShowColorPicker = (
    event: MouseEvent<HTMLButtonElement>,
    type: "backgroundColor" | "color" | "border"
  ) => {
    let element = event.target as HTMLElement;
    setColorPicker({ type, rect: element.getBoundingClientRect() });
  };

  return (
    <Fragment>
      <div className="flex items-center h-[var(--toolbar-height)] bg-mild-blue rounded-full mx-4">
        <div className="flex items-center gap-3 px-4 text-xl">
          <button className="flex items-center">
            <i className="bx-redo"></i>
          </button>
          <button className="flex items-center">
            <i className="bx-undo"></i>
          </button>
          <button className="flex items-center">
            <i className="bx-printer"></i>
          </button>
        </div>
        <div className="border border-r-[#c7c7c7] h-2/3"></div>
        <div className="flex items-center gap-3 px-4 text-xl">
          <button
            className="flex items-center"
            onClick={() => onFormatText("bold")}
          >
            <i className="bx-bold"></i>
          </button>
          <button
            className="flex items-center"
            onClick={() => onFormatText("italic")}
          >
            <i className="bx-italic"></i>
          </button>
          <button
            className="flex items-center"
            onClick={() => onFormatText("underline")}
          >
            <i className="bx-underline"></i>
          </button>
          <button
            className="flex items-center"
            onClick={() => onFormatText("lineThrough")}
          >
            <i className="bx-strikethrough"></i>
          </button>
        </div>
        <div className="border border-r-[#c7c7c7] h-2/3"></div>
        <div className="flex items-center gap-3 px-4 text-xl">
          <button
            className="flex items-center"
            onClick={(e) => handleShowColorPicker(e, "color")}
          >
            <i className="bx-font-color"></i>
          </button>
          <button
            className="flex items-center"
            onClick={(e) => handleShowColorPicker(e, "backgroundColor")}
          >
            <i className="bxs-color-fill"></i>
          </button>
          <button
            className="flex items-center"
            onClick={(e) => handleShowColorPicker(e, "border")}
          >
            <i className="bx-border-all"></i>
          </button>
        </div>
        <div className="border border-r-[#c7c7c7] h-2/3"></div>
        <div className="flex items-center gap-3 px-4 text-xl">
          <button className="flex items-center">
            <i className="bx-align-left"></i>
          </button>
          <button className="flex items-center">
            <i className="bx-align-right"></i>
          </button>
          <button className="flex items-center">
            <i className="bx-align-justify"></i>
          </button>
          <button className="flex items-center">
            <i className="bx-align-middle"></i>
          </button>
        </div>
        <div className="border border-r-[#c7c7c7] h-2/3"></div>
        <div className="flex items-center gap-3 px-4 text-xl">
          <button className="flex items-center">
            <i className="bx-link-alt"></i>
          </button>
        </div>

        {/* <button className="flex items-center">
        <i className="bx-search"></i>
      </button> */}
      </div>
      {colorPicker && (
        <ColorPicker
          rect={colorPicker.rect}
          onClick={handleSelectColor}
          onClose={handleCloseColorPicker}
        />
      )}
    </Fragment>
  );
};

export default ToolBar;
