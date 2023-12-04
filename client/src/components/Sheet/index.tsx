import SheetProvider from "@/context/SheetContext";
import Header from "./Header";
import Grid from "./Grid";
import ToolBar from "./ToolBar";
import Canvas from "./Canvas";
import HighlightCell from "./HighLightCell";
import EditCell from "./EditCell";
import ColumnResizer from "./ColumnResizer";
import RowResizer from "./RowResizer";
import HighLightSearch from "./HighLightSearch";
import HighLightColumn from "./HighLightColumn";
import HighLightRow from "./HighLightRow";
import ColumnOverLay from "./ColumnOverLay";
import RowOverLay from "./RowOverLay";
import ContextMenu from "./ContextMenu";
import GridPages from "./GridPages";

const Sheet = () => {
  return (
    <SheetProvider>
      <Header />
      <ToolBar />
      <Grid>
        <Canvas />
        <HighLightColumn />
        <HighLightRow />
        <div className="absolute left-[var(--col-width)] top-[var(--row-height)] w-[calc(100%-var(--col-width))] h-[calc(100%-var(--row-height))] overflow-hidden">
          <HighlightCell />
          <ColumnOverLay />
          <RowOverLay />
          <HighLightSearch />
        </div>
        <ColumnResizer />
        <RowResizer />
      </Grid>
      <EditCell />
      <ContextMenu />
      <GridPages />
    </SheetProvider>
  );
};

export default Sheet;
