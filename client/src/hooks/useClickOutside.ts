import { useEffect } from "react";

const useClickOutside = (ref: HTMLElement | null, cb: () => void) => {
  useEffect(() => {
    if (!ref) return;
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [ref]);

  const handleClick = (event: MouseEvent) => {
    if (!ref) return;
    let element = event.target as HTMLElement;
    if (ref.contains(element)) return;
    cb();
  };
};

export default useClickOutside;
