import { Fragment, useEffect, useRef, useState } from "react";
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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import ColorPicker from "@/components/Sheet/Grid/ColorPicker";

type IGridCardProps = {
  grid: ISheetGrid;
  gridId: string | null;
  onDeleteGrid: () => void;
  onUpdateGrid: (data: Partial<ISheetGrid>) => void;
  onDuplicateGrid: () => void;
};

const GridCard = ({
  grid: { _id, color, title },
  gridId,
  onDeleteGrid,
  onUpdateGrid,
  onDuplicateGrid,
}: IGridCardProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    focusEditor();
  }, [isEdit]);

  const focusEditor = () => {
    const selection = getSelection();
    if (!selection || !editorRef.current) return;
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    selection.addRange(range);
    editorRef.current.focus();
  };

  const handleBlur = () => {
    if (!editorRef.current) return;
    onUpdateGrid({ title: editorRef.current.innerText });
    setIsEdit(false);
  };

  let isActive = gridId === _id;

  return (
    <Link
      to={{ search: `gridId=${_id}` }}
      className={classNames(
        "relative min-w-fit flex gap-2 justify-center items-center font-medium px-3 transition-colors cursor-pointer",
        {
          "bg-sky-blue text-dark-blue font-semibold": isActive,
          "hover:bg-mild-gray": !isActive,
        }
      )}
      data-gridid={_id}
    >
      {isActive && (
        <span
          className="absolute left-0 bottom-0 h-[3px] w-full"
          style={{ backgroundColor: color }}
        ></span>
      )}
      {isEdit ? (
        <div
          ref={editorRef}
          className="text-sm text-dark-gray px-3 outline outline-2 outline-transparent rounded-sm cursor-text focus:outline-dark-blue"
          contentEditable={isEdit}
          onBlur={handleBlur}
          dangerouslySetInnerHTML={{ __html: title }}
        ></div>
      ) : (
        <span className="text-sm">{title}</span>
      )}
      {!isEdit && isActive ? (
        <Menu placement="top">
          {({ isOpen }) => {
            return (
              <Fragment>
                <MenuButton onClick={(e) => e.stopPropagation()}>
                  <i className={isOpen ? "bx-caret-up" : "bx-caret-down"}></i>
                </MenuButton>
                <Portal>
                  <MenuList zIndex={999}>
                    <MenuItem onClick={() => onDeleteGrid()}>Delete</MenuItem>
                    <MenuItem onClick={onDuplicateGrid}>Duplicate</MenuItem>
                    <MenuItem onClick={() => setIsEdit(true)}>Rename</MenuItem>
                    <MenuItem>
                      <Popover trigger="hover" placement="right">
                        <PopoverTrigger>
                          <span className="w-full">Change color</span>
                        </PopoverTrigger>
                        <Portal>
                          <Box zIndex={999} className="relative w-full h-full">
                            <PopoverContent boxSize="fit-content">
                              <ColorPicker
                                onClick={(color) =>
                                  onUpdateGrid({
                                    color,
                                  })
                                }
                              />
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
      ) : (
        <i
          className={classNames("bx-caret-down", {
            hidden: isEdit,
          })}
        ></i>
      )}
    </Link>
  );
};

export default GridCard;
