import { ChangeEvent, Fragment, MouseEvent, useEffect, useState } from "react";
import classNames from "classnames";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Tooltip,
} from "@chakra-ui/react";
import useSheet from "@/hooks/useSheet";
import ColorPicker from "./ColorPicker";
import { debounce } from "@/utils";

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

const ToolBar = () => {
  const [colorPicker, setColorPicker] = useState<{
    rect: DOMRect;
    type: IPickerOptions;
  } | null>(null);

  const [activeStyle, setActiveStyle] = useState(DEFAULT_ACTIVE_STYLE);

  const {
    quill,
    selectedCell,
    config,
    activeSearchIndex,
    highLightCellIds,
    handleSearchSheet,
    handleFormatCell,
    handleSearchNext,
    handleSearchPrevious,
  } = useSheet();

  useEffect(() => {
    if (!quill) return;

    quill.on("selection-change", handleSelectionChange);
    return () => {
      quill.off("selection-change", handleSelectionChange);
    };
  }, [quill]);

  useEffect(() => {
    if (!selectedCell) return;
    setActiveStyle(DEFAULT_ACTIVE_STYLE);
  }, [selectedCell]);

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

    if (type === "background" || type === "align") {
      handleFormatCell(type, value as string);
      setActiveStyle({ ...activeStyle, [type]: value });
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

  const handleSearch = debounce<ChangeEvent<HTMLInputElement>>(
    (e) => handleSearchSheet(e.target.value),
    500
  );

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
            {({ isOpen }) => (
              <Fragment>
                <Tooltip label="Font" placement="bottom" className="tooltip">
                  <MenuButton className="w-40">
                    <div className="flex justify-between items-center gap-4 pl-4 pr-2">
                      <span>{config.fonts[activeStyle.font]}</span>
                      <i
                        className={classNames(
                          "bx-chevron-down transition-transform",
                          isOpen ? "rotate-180" : "rotate-0"
                        )}
                      ></i>
                    </div>
                  </MenuButton>
                </Tooltip>
                <Portal>
                  <MenuList
                    className="relative bg-white max-h-60 w-40 overflow-y-scroll"
                    zIndex={999}
                  >
                    {config.customFonts.map((value, index) => {
                      return (
                        <MenuItem
                          key={index}
                          className={`ql-font-${value} py-1 px-4`}
                          onClick={() => formatText("font", value)}
                        >
                          {config.fonts[value]}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Portal>
              </Fragment>
            )}
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
        <Divider />
        <div className="flex items-center gap-3 px-4">
          <div className="relative w-56 h-7">
            <input
              placeholder="Find in sheet"
              className="w-full h-full text-sm focus:outline-2 focus:outline-dark-blue pl-3 pr-8 rounded"
              onChange={handleSearch}
            />
            <i className="absolute right-2 top-1/2 -translate-y-1/2 bx-search text-gray-500 text-lg"></i>
          </div>
          {!!highLightCellIds.length && (
            <Fragment>
              <button disabled={!highLightCellIds.length}>
                <i
                  className="bx-chevron-up text-xl text-gray-500"
                  onClick={handleSearchPrevious}
                ></i>
              </button>
              <button disabled={!highLightCellIds.length}>
                <i
                  className="bx-chevron-down text-xl text-gray-500"
                  onClick={handleSearchNext}
                ></i>
              </button>

              <span className="text-xs text-light-gray">
                {activeSearchIndex + 1} of {highLightCellIds.length}
              </span>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ToolBar;
