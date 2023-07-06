import { useEffect } from "react";

const useTitle = (title?: string) => {
  useEffect(() => {
    if (!document || !title || document.title === title) return;
    document.title = title;
  }, [title]);
};

export default useTitle;
