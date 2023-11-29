import { Fragment, MouseEvent, useState } from "react";
import ColorPicker from "./ColorPicker";

type IPickerOptions = "background" | "color" | "border";

type IToolBarProps = {
  onFormatText: IFormatText;
};

const ToolBar = ({ onFormatText }: IToolBarProps) => {
  const [colorPicker, setColorPicker] = useState<{
    rect: DOMRect;
    type: IPickerOptions;
  } | null>(null);

  const handleSelectColor = (colorCode: string) => {
    if (!colorPicker) return;
    formatText(colorPicker.type, colorCode);
    handleCloseColorPicker();
  };

  const handleCloseColorPicker = () => {
    setColorPicker(null);
  };

  const formatText: IFormatText = (type, value) => {
    onFormatText(type, value);
  };

  const handleShowColorPicker = (
    event: MouseEvent<HTMLButtonElement>,
    type: IPickerOptions
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
            onClick={() => formatText("bold", true)}
          >
            <i className="bx-bold"></i>
          </button>
          <button
            className="flex items-center"
            onClick={() => formatText("italic", true)}
          >
            <i className="bx-italic"></i>
          </button>
          <button
            className="flex items-center"
            onClick={() => formatText("underline", true)}
          >
            <i className="bx-underline"></i>
          </button>
          <button
            className="flex items-center"
            onClick={() => formatText("strike", true)}
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
            onClick={(e) => handleShowColorPicker(e, "background")}
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
