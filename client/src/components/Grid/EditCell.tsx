import { useEffect, useMemo, useState, WheelEvent } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { convertToTitle } from "@/utils";

import { ICell, ICellProps } from "@/types/Sheets";

type IEditCell = {
  cell: ICell;
  data: ICellProps;
  onWheel: (event: WheelEvent<HTMLDivElement>) => void;
  onClose: (html: string) => void;
};

const EditCell = ({ cell, data, onWheel, onClose }: IEditCell) => {
  let { x, y, rowId, height, columnId, width } = cell;

  let {
    color = "#000000",
    backgroundColor = "#FFFFFF",
    html = "",
  } = data ?? {};

  const [textEditor, setTextEditor] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    focusEditor();
  }, [textEditor]);

  const focusEditor = () => {
    if (!textEditor) return;

    // Create a Range and set its end to the last child of the contentEditable element
    let range = document.createRange();
    range.selectNodeContents(textEditor);
    range.collapse(false); // Move the cursor to the end

    // Create a Selection and add the range to it
    let selection = window.getSelection();

    if (!selection) return;

    selection.removeAllRanges(); // Clear any existing selections
    selection.addRange(range);

    // Focus the contentEditable element to ensure the caret is visible
    textEditor.focus();
  };

  const handleClose = () => {
    onClose("");
  };

  const cellId = useMemo(() => {
    return `${convertToTitle(columnId)}${rowId}`;
  }, [columnId]);

  useClickOutside(textEditor, handleClose);

  return (
    <div
      className="absolute flex border-1 outline outline-3 outline-light-blue p-[2px] z-10"
      style={{
        minWidth: width,
        minHeight: height,
        left: x,
        top: y,
        backgroundColor,
        color,
      }}
      onWheel={onWheel}
    >
      <div
        ref={setTextEditor}
        className="w-full text-black text-[14px] outline outline-2 outline-dark-blue p-1 leading-[1.2]"
        dangerouslySetInnerHTML={{ __html: html }}
        contentEditable
      ></div>
      <div className="absolute -top-7 left-0 bg-blue text-xs font-medium text-white rounded-sm px-2 py-1">
        {cellId}
      </div>
    </div>
  );
};

export default EditCell;
