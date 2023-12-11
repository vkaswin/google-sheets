import { lazy } from "react";
import SheetProvider from "@/context/SheetContext";
const Header = lazy(() => import("./Header"));
const Grid = lazy(() => import("@/components/Grid"));
const ToolBar = lazy(() => import("@/components/ToolBar"));
const BottomBar = lazy(() => import("@/components/BottomBar"));

const Sheet = () => {
  return (
    <SheetProvider>
      <Header />
      <ToolBar />
      <Grid />
      <BottomBar />
    </SheetProvider>
  );
};

export default Sheet;
