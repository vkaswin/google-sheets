import { Fragment } from "react";
import Toolbar from "./Toolbar";
import TypingBar from "./TypingBar";
import Grid from "./Grid";
import BottomBar from "./BottomBar";

const Detail = () => {
  return (
    <Fragment>
      <Toolbar />
      <TypingBar />
      <Grid />
      <BottomBar />
    </Fragment>
  );
};

export default Detail;
