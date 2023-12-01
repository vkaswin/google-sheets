import {
  Fragment,
  MouseEvent,
  useEffect,
  useRef,
  useState,
  CSSProperties,
} from "react";
import Quill from "quill";
import classNames from "classnames";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Tooltip,
} from "@chakra-ui/react";
import ColorPicker from "./ColorPicker";
import { CUSTOM_FONTS, FONTS } from "./Config";

type IToolBarProps = {
  quill: Quill | null;
  cellId?: string;
  onFormat: IFormatText;
};

const activeClassName = "bg-light-blue rounded";
const btnClassName = "flex justify-center items-center w-[24px] h-[24px]";

const DEFAULT_ACTIVE_STYLE: IActiveStyle = {
  bold: false,
  strike: false,
  italic: false,
  font: "open-sans",
  underline: false,
  background: "#ffffff",
  color: "#000000",
  alignLeft: false,
  alignMiddle: false,
  alignRight: false,
  link: false,
};

const ToolBar = ({ quill, cellId, onFormat }: IToolBarProps) => {
  const [colorPicker, setColorPicker] = useState<{
    rect: DOMRect;
    type: IPickerOptions;
  } | null>(null);

  const [activeStyle, setActiveStyle] = useState(DEFAULT_ACTIVE_STYLE);

  useEffect(() => {
    if (!quill) return;
    quill.on("selection-change", handleSelectionChange);
    return () => {
      quill.off("selection-change", handleSelectionChange);
    };
  }, [quill]);

  useEffect(() => {
    if (!cellId) return;
    setActiveStyle(DEFAULT_ACTIVE_STYLE);
  }, [cellId]);

  const handleSelectionChange = () => {
    if (!quill) return;

    let { bold, strike, font, underline, background, color, italic } =
      quill.getFormat();

    setActiveStyle({
      bold: !!bold,
      strike: !!strike,
      underline: !!underline,
      italic: !!italic,
      alignLeft: false,
      alignMiddle: false,
      alignRight: false,
      link: false,
      font: font || DEFAULT_ACTIVE_STYLE.font,
      background: background || DEFAULT_ACTIVE_STYLE.background,
      color: color || DEFAULT_ACTIVE_STYLE.color,
    });
  };

  const handleSelectColor = (colorCode: string) => {
    if (!colorPicker) return;
    formatText(colorPicker.type, colorCode);
    handleCloseColorPicker();
  };

  const handleCloseColorPicker = () => {
    setColorPicker(null);
  };

  const formatText: IFormatText = (type, value) => {
    if (!quill) return;

    let selection = quill.getSelection();

    if (!selection || selection.length === 0) {
      onFormat(type, value as string);
      setActiveStyle({ ...activeStyle, [type]: value });
    } else if (type === "align") {
      console.log(type, value);
    } else {
      quill.format(type, value);
    }
  };

  const handleShowColorPicker = (
    event: MouseEvent<HTMLButtonElement>,
    type: IPickerOptions
  ) => {
    let element = event.target as HTMLElement;
    setColorPicker({ type, rect: element.getBoundingClientRect() });
  };

  const handleRemoveFormat = () => {
    if (!quill) return;
    let selection = quill.getSelection();
    if (!selection) return;
    quill.removeFormat(selection.index, selection.length);
    handleSelectionChange();
  };

  const Divider = () => <div className="border border-r-[#c7c7c7] h-2/3"></div>;

  return (
    <Fragment>
      <div className="flex items-center h-[calc(var(--toolbar-height)-10px)] bg-mild-blue rounded-full mx-4 mb-[10px]">
        <div className="flex items-center gap-3 px-4 text-xl">
          <button className="flex items-center" disabled>
            <i className="bx-redo"></i>
          </button>
          <button className="flex items-center" disabled>
            <i className="bx-undo"></i>
          </button>
        </div>
        <Divider />
        <div>
          <Menu placement="bottom">
            <Tooltip label="Font" placement="bottom" className="tooltip">
              <MenuButton className="w-40">
                <div className="flex justify-between items-center gap-4 pl-4 pr-2">
                  <span>{FONTS[activeStyle.font]}</span>
                  <i className="bx-chevron-down"></i>
                </div>
              </MenuButton>
            </Tooltip>
            <Portal>
              <MenuList
                className="relative bg-white max-h-60 w-40 overflow-y-scroll"
                zIndex={999}
              >
                {CUSTOM_FONTS.map((value, index) => {
                  return (
                    <MenuItem
                      key={index}
                      className={`ql-font-${value} py-1 px-4`}
                      onClick={() => formatText("font", value)}
                    >
                      {FONTS[value]}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Portal>
          </Menu>
        </div>
        <Divider />
        <div className="flex items-center gap-3 px-4 text-xl">
          <Tooltip className="tooltip" label="Bold (Ctrl+B)">
            <button
              className={classNames(btnClassName, {
                [activeClassName]: activeStyle.bold,
              })}
            >
              <i className="bx-bold"></i>
            </button>
          </Tooltip>
          <Tooltip className="tooltip" label="Italic (Ctrl+I)">
            <button
              className={classNames(btnClassName, {
                [activeClassName]: activeStyle.italic,
              })}
              onClick={() => formatText("italic", true)}
            >
              <i className="bx-italic"></i>
            </button>
          </Tooltip>
          <Tooltip className="tooltip" label="Underline (Ctrl+U)">
            <button
              className={classNames(btnClassName, {
                [activeClassName]: activeStyle.underline,
              })}
              onClick={() => formatText("underline", true)}
            >
              <i className="bx-underline"></i>
            </button>
          </Tooltip>
          <Tooltip className="tooltip" label="Strikethrough (Ctrl+S)">
            <button
              className={classNames(btnClassName, {
                [activeClassName]: activeStyle.strike,
              })}
              onClick={() => formatText("strike", true)}
            >
              <i className="bx-strikethrough"></i>
            </button>
          </Tooltip>
        </div>
        <Divider />
        <div className="flex items-center gap-3 px-4 text-xl">
          <Tooltip className="tooltip" label="Text color">
            <button
              className={classNames(btnClassName, "flex-col")}
              onClick={(e) => handleShowColorPicker(e, "color")}
            >
              <i className="bx-font"></i>
              <span
                className="w-full h-2 shadow-sm"
                style={{ backgroundColor: activeStyle.color }}
              ></span>
            </button>
          </Tooltip>
          <Tooltip className="tooltip" label="Fill color">
            <button
              className={classNames(btnClassName, "flex-col")}
              onClick={(e) => handleShowColorPicker(e, "background")}
            >
              <i className="bxs-color-fill"></i>
              <span
                className="w-full h-2 shadow-sm"
                style={{ backgroundColor: activeStyle.background }}
              ></span>
            </button>
          </Tooltip>
        </div>
        <Divider />
        <div className="flex items-center gap-3 px-4 text-xl">
          <Tooltip className="tooltip" label="Remove format">
            <button className={btnClassName} onClick={handleRemoveFormat}>
              <i className="bxs-eraser"></i>
            </button>
          </Tooltip>
        </div>
        <Divider />
        <div className="flex items-center gap-3 px-4 text-xl">
          <Tooltip className="tooltip" label="Left">
            <button
              className={classNames(btnClassName, {
                [activeClassName]: activeStyle.alignLeft,
              })}
            >
              <i className="bx-align-left"></i>
            </button>
          </Tooltip>
          <Tooltip className="tooltip" label="Center">
            <button
              className={classNames(btnClassName, {
                [activeClassName]: activeStyle.alignMiddle,
              })}
            >
              <i className="bx-align-middle"></i>
            </button>
          </Tooltip>
          <Tooltip className="tooltip" label="Right">
            <button
              className={classNames(btnClassName, {
                [activeClassName]: activeStyle.alignLeft,
              })}
            >
              <i className="bx-align-right"></i>
            </button>
          </Tooltip>
        </div>
        <Divider />
        <div className="flex items-center gap-3 px-4 text-xl">
          <Tooltip className="tooltip" label="Insert link (Ctrl+k)">
            <button
              className={classNames(btnClassName, {
                [activeClassName]: activeStyle.link,
              })}
            >
              <i className="bx-link-alt"></i>
            </button>
          </Tooltip>
          <Tooltip className="tooltip" label="Insert comment (Ctrl+Alt+M)">
            <button className={btnClassName}>
              <i className="bx-comment-add"></i>
            </button>
          </Tooltip>
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
