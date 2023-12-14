import { Fragment } from "react";
import Header from "./Header";
import ToolBar from "./ToolBar";
import BottomBar from "./BottomBar";
import Grid from "@/components/Sheet/Grid";
import Loader from "@/components/Loader";
import { useSheet } from "@/hooks/useSheet";

const Sheet = () => {
  const { isSheetLoading } = useSheet();

  return (
    <div className="w-full h-full">
      {isSheetLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <Header />
          <ToolBar />
          <Grid />
          <BottomBar />
        </Fragment>
      )}
    </div>
  );
};

export default Sheet;
