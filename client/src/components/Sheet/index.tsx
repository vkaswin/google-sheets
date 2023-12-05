import SheetProvider from "@/context/SheetContext";
import Header from "./Header";
import Grid from "./Grid";
import ToolBar from "./ToolBar";
import GridList from "./GirdList";

const Sheet = () => {
  return (
    <SheetProvider>
      <Header />
      <ToolBar />
      <Grid />
      <GridList />
    </SheetProvider>
  );
};

export default Sheet;
