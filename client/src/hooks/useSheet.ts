import { useContext } from "react";
import { SheetContext } from "@/context/SheetContext";

const useSheet = () => {
  return useContext(SheetContext);
};

export default useSheet;
