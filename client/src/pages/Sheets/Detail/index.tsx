import { Fragment } from "react";
import Header from "@/components/Sheets/Header";
import Toolbar from "@/components/Sheets/Toolbar";
import TypingBar from "@/components/Sheets/TypingBar";
import Grid from "@/components/Sheets/Grid";
import BottomBar from "@/components/Sheets/BottomBar";

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
