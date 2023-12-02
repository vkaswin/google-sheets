import { useCallback, useEffect, useMemo, useRef, WheelEvent } from "react";
import { convertToTitle, debounce } from "@/utils";
import classNames from "classnames";

type IEditCellProps = {
  cell: ICell | null;
  data: ICellProps | null;
  onWheel: (event: WheelEvent<HTMLDivElement>) => void;
  onEditorChange: (cell: ICell) => void;
};

const EditCell = ({ cell, data, onWheel, onEditorChange }: IEditCellProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  let { x, y, rowId, height, columnId, width } = cell || {};

  let { background = "#FFFFFF", color } = data ?? {};

  const cellId = useMemo(() => {
    if (!columnId) return "";
    return `${convertToTitle(columnId)}${rowId}`;
  }, [columnId]);

  useEffect(() => {
    if (!cell) return;
    focusEditor();
  }, [cell]);

  const focusEditor = () => {
    if (!editorRef.current) return;

    const element = editorRef.current.firstElementChild as HTMLElement;

    if (!element) return;

    const selection = getSelection();

    if (!selection) return;

    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.addRange(range);
    element.focus();
  };

  const handleChange = () => {
    if (!cell) return;
    onEditorChange(cell);
  };

  const handleKeyDown = useCallback(debounce(handleChange, 500), [cell]);

  return (
    <div
      className={classNames(
        "absolute flex border-1 outline outline-3 outline-light-blue leading-5 p-[2px] z-10",
        {
          "hidden pointer-events-none": !cell,
        }
      )}
      style={{
        minWidth: width,
        minHeight: height,
        left: x,
        top: y,
      }}
      onWheel={onWheel}
      onKeyDown={handleKeyDown}
    >
      <div
        id="editor"
        ref={editorRef}
        className="w-full text-black text-[14px] outline outline-2 outline-dark-blue px-[5px]"
        style={{ background, color }}
      ></div>
      <div className="absolute -top-7 left-0 bg-blue text-xs font-medium text-white rounded-sm px-2 py-1">
        {cellId}
      </div>
    </div>
  );
};

export default EditCell;
