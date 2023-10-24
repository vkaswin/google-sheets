import { Fragment } from "react";
import Toolbar from "./Toolbar";
import TypingBar from "./TypingBar";
import Grid from "./Grid";
import BottomBar from "./BottomBar";
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
