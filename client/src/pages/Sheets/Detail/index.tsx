import { Fragment } from "react";
import Header from "@/components/Header";
import Toolbar from "@/components/Toolbar";
import TypingBar from "@/components/TypingBar";
import Grid from "@/components/Grid";
import BottomBar from "@/components/BottomBar";

const Detail = () => {
  return (
    <Fragment>
      <Header />
      <Toolbar />
      <TypingBar />
      <Grid />
      <BottomBar />
    </Fragment>
  );
};

export default Detail;
