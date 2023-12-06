import { useMemo, useState } from "react";
import { usePopper } from "react-popper";
import { VirtualElement } from "@popperjs/core";

const actions = [
  [
    { icon: "bx-cut", label: "Cut", shortcut: "Ctrl+X", eventName: "onCut" },
    { icon: "bx-copy", label: "Copy", shortcut: "Ctrl+C", eventName: "onCopy" },
    {
      icon: "bx-paste",
      label: "Paste",
      shortcut: "Ctrl+P",
      eventName: "onPaste",
    },
  ],
  [
    {
      icon: "bx-plus",
      label: "Insert one row top",
      eventName: "onInsertRow",
      direction: "top",
    },
    {
      icon: "bx-plus",
      label: "Insert one row bottom",
      eventName: "onInsertRow",
      direction: "bottom",
    },
    {
      icon: "bx-plus",
      label: "Insert one column left",
      eventName: "onInsertColumn",
      direction: "left",
    },
    {
      icon: "bx-plus",
      label: "Insert one column right",
      eventName: "onInsertColumn",
      direction: "right",
    },
  ],
  [
    { icon: "bx-trash", label: "Delete row", eventName: "onDeleteRow" },
    { icon: "bx-trash", label: "Delete column", eventName: "onDeleteColumn" },
    { icon: "bx-trash", label: "Delete cell", eventName: "onDeleteCell" },
  ],
] as const;

type IContextMenuProps = {
  rect: Pick<DOMRect, "x" | "y">;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onDeleteCell: () => void;
  onInsertColumn: (direction: IDirection) => void;
  onInsertRow: (direction: IDirection) => void;
};

const ContextMenu = ({ rect, ...events }: IContextMenuProps) => {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const virtualReference = useMemo(() => {
    return {
      getBoundingClientRect: () => {
        return {
          width: 0,
          height: 0,
          right: 0,
          bottom: 0,
          left: rect.x,
          top: rect.y,
        };
      },
    } as VirtualElement;
  }, [rect]);

  const { attributes, styles } = usePopper(virtualReference, popperElement, {
    placement: "right",
  });

  return (
    <div
      ref={setPopperElement}
      className="w-72 shadow-[0_2px_6px_2px_rgba(60,64,67,.15)] border border-transparent rounded bg-white z-50"
      style={styles.popper}
      {...attributes.popper}
    >
      <div className="flex flex-col py-3 font-medium">
        {actions[0].map(({ icon, label, shortcut, eventName }, index) => {
          return (
            <button
              key={index}
              className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
              onClick={() => events[eventName]}
            >
              <span className="flex items-center gap-3">
                <i className={`${icon} text-xl`}></i>
                {label}
              </span>
              <span>{shortcut}</span>
            </button>
          );
        })}
        <div className="w-full h-[1px] bg-[#dadce0] my-3"></div>
        {actions[1].map(({ icon, label, eventName, direction }, index) => {
          return (
            <button
              key={index}
              className="flex gap-3 items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
              onClick={() => events[eventName](direction)}
            >
              <i className={`${icon} text-xl`}></i>
              <span>{label}</span>
            </button>
          );
        })}
        <div className="w-full h-[1px] bg-[#dadce0] my-3"></div>
        {actions[2].map(({ icon, label, eventName }, index) => {
          return (
            <button
              key={index}
              className="flex gap-3 items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
              onClick={() => events[eventName]}
            >
              <i className={`${icon} text-xl`}></i>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContextMenu;
