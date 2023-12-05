import { Fragment, WheelEvent, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSheet from "@/hooks/useSheet";
import classNames from "classnames";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Tooltip,
} from "@chakra-ui/react";

const SheetList = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { sheetDetail, handleCreateSheet } = useSheet();

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

  let { _id, grids = [] } = sheetDetail || {};

  return (
    <div className="fixed flex gap-4 left-0 bottom-0 w-full h-[var(--bottom-bar-height)] pl-[var(--col-width)] after:absolute after:top-[-1px] after:right-0 after:w-[var(--scrollbar-size)] after:h-[1px] after:bg-light-gray">
      <div className="flex items-center gap-3">
        <button
          onClick={handleCreateSheet}
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
                        isActive ? "visible" : "invisible"
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
        {grids.map(({ _id, color, title }) => {
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
                          <MenuItem>Delete</MenuItem>
                          <MenuItem>Duplicate</MenuItem>
                          <MenuItem>Rename</MenuItem>
                          <MenuItem>Change color</MenuItem>
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

export default SheetList;
