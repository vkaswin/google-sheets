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
import { Fragment } from "react";

const GridPages = () => {
  const { metaData, activeSheetId, setActiveSheetId } = useSheet();

  let { sheets = [] } = metaData || {};

  const handleClick = (id: string) => {
    setActiveSheetId(id);
  };

  return (
    <div className="fixed flex gap-4 left-0 bottom-0 w-full h-[var(--bottom-bar-height)] pl-[var(--col-width)] after:absolute after:top-[-1px] after:right-0 after:w-[var(--scrollbar-size)] after:h-[1px] after:bg-light-gray">
      <div className="flex gap-3">
        <button>
          <Tooltip label="Add Sheet">
            <i className="bx-plus text-xl"></i>
          </Tooltip>
        </button>
        <button>
          <Tooltip label="All Sheets">
            <i className="bx-menu text-xl"></i>
          </Tooltip>
        </button>
      </div>
      <div className="flex">
        {sheets.map(({ _id, color, title }) => {
          const isActive = _id === activeSheetId;
          return (
            <div
              key={_id}
              className={classNames(
                "relative flex gap-2 justify-center items-center font-medium px-3 cursor-pointer",
                {
                  "bg-sky-blue text-dark-blue font-semibold": isActive,
                }
              )}
              onClick={() => handleClick(_id)}
            >
              {isActive && (
                <span
                  className="absolute left-0 bottom-0 h-[2px] w-full"
                  style={{ backgroundColor: color }}
                ></span>
              )}
              <span className="text-sm">{title}</span>
              <Menu placement="top">
                {({ isOpen }) => {
                  return (
                    <Fragment>
                      <MenuButton>
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

export default GridPages;
// bx-check
//
//
