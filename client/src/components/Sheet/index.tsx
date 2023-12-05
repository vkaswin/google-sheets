import SheetProvider from "@/context/SheetContext";
import Header from "./Header";
import Grid from "./Grid";
import ToolBar from "./ToolBar";
import SheetList from "./SheetList";

const Sheet = () => {
  return (
    <SheetProvider>
      <Header />
      <ToolBar />
      <Grid />
      <SheetList />
    </SheetProvider>
  );
};

export default Sheet;
