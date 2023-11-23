import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  WheelEvent,
} from "react";
import { convertToTitle, EventEmitter, debounce } from "@/utils";

type IEditCell = {
  cell: ICell;
  data: ICellProps;
  onWheel: (event: WheelEvent<HTMLDivElement>) => void;
};

const EditCell = forwardRef<IEditorRef | null, IEditCell>(
  ({ cell, data, onWheel }, ref) => {
    let { x, y, rowId, height, columnId, width } = cell;

    let {
      color = "#000000",
      backgroundColor = "#FFFFFF",
      html = "",
    } = data ?? {};

    const [textEditor, setTextEditor] = useState<HTMLDivElement | null>(null);

    const { current: emitter } = useRef(new EventEmitter());

    const cellId = useMemo(() => {
      return `${convertToTitle(columnId)}${rowId}`;
    }, [columnId]);

    useEffect(() => {
      if (!textEditor) return;
      focusEditor(textEditor);
    }, [textEditor]);

    const focusEditor = (element: HTMLElement) => {
      // Create a Range and set its end to the last child of the contentEditable element
      let range = document.createRange();
      range.selectNode(element);
      range.collapse(false); // Move the cursor to the end

      // Create a Selection and add the range to it
      let selection = window.getSelection();

      if (!selection) return;

      selection.removeAllRanges(); // Clear any existing selections
      selection.addRange(range);

      // Focus the contentEditable element to ensure the caret is visible
      element.focus();
    };

    let convertToString = (nodes: HTMLCollection) => {
      let html = "";

      for (let node of nodes) {
        if (node.tagName === "BR") {
          html += "<br>";
          continue;
        }

        let {
          style: {
            backgroundColor,
            color,
            fontSize,
            fontWeight,
            textDecoration,
            fontStyle,
          } = {},
          textContent,
        } = node as HTMLElement;

        let style = "";
        if (backgroundColor) style += `backgroundColor:${backgroundColor};`;
        if (color) style += `color:${color};`;
        if (fontSize) style += `font-size:${fontSize};`;
        if (fontWeight) style += `font-weight:${fontWeight};`;
        if (fontStyle) style += `font-style:${fontStyle};`;
        if (textDecoration) style += `text-decoration:${textDecoration};`;

        html += `<span style="${style}">${textContent}</span>`;

        html += convertToString(node.childNodes as any);
      }

      return html;
    };

    const formatText: IFormatText = (type, value) => {
      let selection = getSelection();

      if (!selection) return;

      let range = selection.getRangeAt(0);
      let span = document.createElement("span");

      // range.deleteContents();

      if (type === "bold") {
        span.style.fontWeight = "bold";
      } else if (type === "italic") {
        span.style.fontStyle = "italic";
      } else if (type === "underline") {
        span.style.textDecoration = "underline";
      } else if (type === "lineThrough") {
        span.style.textDecoration = "line-through";
      } else if (type === "color" && value) {
        span.style.color = value;
      } else if (type === "backgroundColor" && value) {
        span.style.backgroundColor = value;
      }

      // Extract the contents of the range into a DocumentFragment
      let fragment = range.extractContents();
      // Append the DocumentFragment to the wrapper element
      span.appendChild(fragment);
      // Insert the wrapper back into the range
      range.insertNode(span);

      handleChange();
    };

    const handleChange = () => {
      if (!textEditor) return;
      emitter.emit("change", convertToString(textEditor.childNodes as any));
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          formatText,
          on: emitter.addEventListener.bind(emitter),
        };
      },
      [textEditor]
    );

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
          className="w-full text-black text-[14px] outline outline-2 outline-dark-blue px-[5px]"
          dangerouslySetInnerHTML={{ __html: html }}
          onInput={debounce(handleChange, 500)}
          contentEditable
        ></div>
        <div className="absolute -top-7 left-0 bg-blue text-xs font-medium text-white rounded-sm px-2 py-1">
          {cellId}
        </div>
      </div>
    );
  }
);

export default EditCell;
