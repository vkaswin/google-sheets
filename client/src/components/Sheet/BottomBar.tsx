import { Fragment, WheelEvent, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSheet } from "@/hooks/useSheet";
import classNames from "classnames";
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Tooltip,
} from "@chakra-ui/react";
import ColorPicker from "../Grid/ColorPicker";

const BottomBar = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { sheetDetail, handleCreateGrid, handleDeleteGrid } = useSheet();

  const navigate = useNavigate();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const gridId = searchParams.get("gridId");

  const handleScroll = (event: WheelEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;

    scrollContainerRef.current.scrollBy({
      behavior: "smooth",
      left: event.deltaY,
    });
  };

  const handleChangeColor = (colorCode: string) => {
    console.log(colorCode);
  };

  let { grids = [] } = sheetDetail || {};

  return (
    <div className="fixed flex gap-4 left-0 bottom-0 w-full h-[var(--bottom-bar-height)] pl-4 bg-white after:absolute after:-top-[var(--scrollbar-size)] after:right-0 after:w-[var(--scrollbar-size)] after:h-[var(--scrollbar-size)] after:border-b-light-gray after:border after:bg-white z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={handleCreateGrid}
          className="w-8 h-8 rounded-full bg-transparent hover:bg-dark-silver transition-colors"
        >
          <Tooltip label="Add Sheet">
            <i className="bx-plus text-xl"></i>
          </Tooltip>
        </button>
        <Menu placement="top-start">
          <Tooltip label="All Sheets" offset={[0, 3]}>
            <MenuButton className="w-8 h-8 rounded-full bg-transparent hover:bg-dark-silver transition-colors">
              <i className="bx-menu text-xl"></i>
            </MenuButton>
          </Tooltip>
          <Portal>
            <MenuList zIndex={999}>
              {grids.map(({ _id, title, color = "transperant" }) => {
                let isActive = _id === gridId;
                return (
                  <MenuItem key={_id} className="flex items-center gap-2">
                    <i
                      className={classNames(
                        "bx-check text-xl text-dark-gray",
                        isActive ? "block" : "hidden"
                      )}
                    ></i>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    ></span>
                    <span key={_id}>{title}</span>
                  </MenuItem>
                );
              })}
            </MenuList>
          </Portal>
        </Menu>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto hide-scrollbar"
        onWheel={handleScroll}
      >
        {grids.map(({ _id, color, title }, index) => {
          const isActive = _id === gridId;
          return (
            <div
              key={_id}
              className={classNames(
                "relative min-w-fit flex gap-2 justify-center items-center font-medium px-3 transition-colors cursor-pointer",
                {
                  "bg-sky-blue text-dark-blue font-semibold": isActive,
                  "hover:bg-mild-gray": !isActive,
                }
              )}
              onClick={() => navigate({ search: `gridId=${_id}` })}
            >
              {isActive && (
                <span
                  className="absolute left-0 bottom-0 h-[3px] w-full"
                  style={{ backgroundColor: color }}
                ></span>
              )}
              <span className="text-sm">{title}</span>
              <Menu placement="top">
                {({ isOpen }) => {
                  return (
                    <Fragment>
                      <MenuButton onClick={(e) => e.stopPropagation()}>
                        <i
                          className={isOpen ? "bx-caret-up" : "bx-caret-down"}
                        ></i>
                      </MenuButton>
                      <Portal>
                        <MenuList zIndex={999}>
                          <MenuItem
                            onClick={() => handleDeleteGrid(_id, index)}
                          >
                            Delete
                          </MenuItem>
                          <MenuItem>Duplicate</MenuItem>
                          <MenuItem>Rename</MenuItem>
                          <MenuItem>
                            <Popover trigger="hover" placement="right">
                              <PopoverTrigger>
                                <span className="w-full">Change color</span>
                              </PopoverTrigger>
                              <Portal>
                                <Box
                                  zIndex={999}
                                  className="relative w-full h-full"
                                >
                                  <PopoverContent boxSize="fit-content">
                                    <ColorPicker onClick={handleChangeColor} />
                                  </PopoverContent>
                                </Box>
                              </Portal>
                            </Popover>
                          </MenuItem>
                        </MenuList>
                      </Portal>
                    </Fragment>
                  );
                }}
              </Menu>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomBar;
