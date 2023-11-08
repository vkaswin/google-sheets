import { useEffect, useRef, useState, WheelEvent } from "react";
import Quill from "quill";
import { convertToTitle } from "@/utils";

import { ICell, ICellProps } from "@/types/Sheets";
import useClickOutside from "@/hooks/useClickOutside";

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

  const quillRef = useRef<Quill>();

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    quillRef.current = new Quill("#editor");
    focusEditor();
    quillRef.current.on("editor-change", () => {
      console.log(quillRef.current?.getContents(), quillRef.current?.getText());
    });
  }, []);

  const focusEditor = () => {
    if (!quillRef.current) return;

    let element = quillRef.current.root;

    // Create a Range and set its end to the last child of the contentEditable element
    let range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false); // Move the cursor to the end

    // Create a Selection and add the range to it
    let selection = window.getSelection();

    if (!selection) return;

    selection.removeAllRanges(); // Clear any existing selections
    selection.addRange(range);

    // Focus the contentEditable element to ensure the caret is visible
    element.focus();
  };

  const handleClose = () => {
    if (!quillRef.current) return;

    let lines = quillRef.current.getLines();
    let html = "";

    for (let line of lines) {
      for (let ops of line.cache.delta.ops) {
        let {
          insert = "",
          attributes: {
            italic = false,
            bold = false,
            background = "",
            color = "",
          } = {},
        } = ops;

        insert = insert.replaceAll("\n", "");

        if (!insert) continue;

        let style = "";

        if (italic) style += "font-style:italic;";
        if (bold) style += "font-weight:bold;";
        if (color) style += `color:${color};`;
        if (background) style += `background:${background};`;

        html += `<span${style ? ` style="${style}"` : ""}>${insert}</span>`;
      }

      html += "<br/>";
    }

    onClose(html);
  };

  useClickOutside(container, handleClose);

  return (
    <div
      ref={setContainer}
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
        id="editor"
        className="w-full text-black text-sm outline outline-2 outline-dark-blue p-[2px]"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
      <div className="absolute -top-7 left-0 bg-blue text-xs font-medium text-white rounded-sm px-2 py-1">
        {convertToTitle(columnId)}
        {rowId}
      </div>
    </div>
  );
};

export default EditCell;
