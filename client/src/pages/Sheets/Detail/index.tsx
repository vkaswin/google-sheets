import { Fragment } from "react";
import Toolbar from "@/components/Toolbar";
import TypingBar from "@/components/TypingBar";
import Grid from "@/components/Grid";
import BottomBar from "@/components/BottomBar";
import { sheetDetail } from "./data";

const Detail = () => {
  return (
    <Fragment>
      <Toolbar />
      <TypingBar />
      <Grid sheetDetail={sheetDetail} />
      <BottomBar />
    </Fragment>
  );
};

export default Detail;
