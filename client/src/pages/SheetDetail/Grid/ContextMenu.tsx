import { IRect } from "@/types/Sheets";

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
      eventName: "onInsertRowTop",
    },
    {
      icon: "bx-plus",
      label: "Insert one row bottom",
      eventName: "onInsertRowBottom",
    },
    {
      icon: "bx-plus",
      label: "Insert one column left",
      eventName: "onInsertColumnLeft",
    },
    {
      icon: "bx-plus",
      label: "Insert one column right",
      eventName: "onInsertColumnRight",
    },
  ],
  [
    { icon: "bx-trash", label: "Delete row", eventName: "onDeleteRow" },
    { icon: "bx-trash", label: "Delete column", eventName: "onDeleteColumn" },
    { icon: "bx-trash", label: "Delete cell", eventName: "onDeleteCell" },
  ],
] as const;

type IContextMenu = {
  position: Pick<IRect, "x" | "y">;
  onCut: () => void;
  onPaste: () => void;
  onCopy: () => void;
  onDeleteColumn: () => void;
  onDeleteCell: () => void;
  onDeleteRow: () => void;
  onInsertRowTop: () => void;
  onInsertRowBottom: () => void;
  onInsertColumnRight: () => void;
  onInsertColumnLeft: () => void;
};

const ContextMenu = ({ position: { x, y }, ...events }: IContextMenu) => {
  return (
    <div
      className="fixed w-72 shadow-[0_2px_6px_2px_rgba(60,64,67,.15)] border border-transparent rounded bg-white z-20"
      style={{ left: x, top: y - 100 }}
    >
      <div className="flex flex-col py-3 font-medium">
        {actions[0].map(({ icon, label, shortcut, eventName }, index) => {
          return (
            <button
              key={index}
              className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
              onClick={events[eventName]}
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
        {actions[1].map(({ icon, label, eventName }, index) => {
          return (
            <button
              key={index}
              className="flex gap-3 items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
              onClick={events[eventName]}
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
              onClick={events[eventName]}
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
