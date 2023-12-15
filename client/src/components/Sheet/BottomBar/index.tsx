import { WheelEvent, useRef, useEffect, useLayoutEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSheet } from "@/hooks/useSheet";
import classNames from "classnames";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Tooltip,
} from "@chakra-ui/react";
import GridCard from "./GridCard";

const BottomBar = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    sheetDetail,
    handleCreateGrid,
    handleDeleteGrid,
    handleUpdateGrid,
    handleDuplicateGrid,
  } = useSheet();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const gridId = searchParams.get("gridId");

  useLayoutEffect(() => {
    const element = document.querySelector(`[data-gridid="${gridId}"]`);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", inline: "nearest" });
  }, [gridId]);

  const handleScroll = (event: WheelEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;

    scrollContainerRef.current.scrollBy({
      behavior: "smooth",
      left: event.deltaY,
    });
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
            <MenuList zIndex={999} className="max-h-60 overflow-y-auto">
              {grids.map(({ _id, title, color = "transperant" }) => {
                let isActive = _id === gridId;
                return (
                  <Link key={_id} to={{ search: `gridId=${_id}` }}>
                    <MenuItem className="flex items-center gap-2">
                      <i
                        className={classNames(
                          "bx-check text-xl text-dark-gray",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      ></i>
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span key={_id}>{title}</span>
                    </MenuItem>
                  </Link>
                );
              })}
            </MenuList>
          </Portal>
        </Menu>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex overflow-hidden"
        onWheel={handleScroll}
      >
        {grids.map((grid, index) => {
          return (
            <GridCard
              key={grid._id}
              grid={grid}
              gridId={gridId}
              onDeleteGrid={() => handleDeleteGrid(index, grid._id)}
              onUpdateGrid={(data) => handleUpdateGrid(index, grid._id, data)}
              onDuplicateGrid={() => handleDuplicateGrid(grid._id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BottomBar;
