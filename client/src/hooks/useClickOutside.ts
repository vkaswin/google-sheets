import { useEffect } from "react";

type IUseClickOutSide = (
  ref: HTMLElement | null,
  options: {
    onClose: () => void;
    doNotClose?: (element: HTMLElement) => boolean;
  }
) => void;

const useClickOutside: IUseClickOutSide = (ref, { doNotClose, onClose }) => {
  useEffect(() => {
    if (!ref) return;
    setTimeout(() => document.addEventListener("click", handleClick), 0);
    return () => document.removeEventListener("click", handleClick);
  }, [ref]);

  const handleClick = (event: MouseEvent) => {
    if (!ref) return;
    let element = event.target as HTMLElement;
    if (ref.contains(element) || doNotClose?.(element)) return;
    onClose();
  };
};

export default useClickOutside;
