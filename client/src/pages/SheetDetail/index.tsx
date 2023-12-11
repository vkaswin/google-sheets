import SheetProvider from "@/context/SheetContext";
import Header from "./Header";
import Grid from "@/components/Grid";
import ToolBar from "@/components/ToolBar";
import BottomBar from "@/components/BottomBar";

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
