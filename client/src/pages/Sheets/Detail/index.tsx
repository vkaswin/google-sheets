import { Fragment } from "react";
import GridTable from "@/components/Sheets/GridTable";
import Header from "@/components/Sheets/Header";
import Toolbar from "@/components/Sheets/Toolbar";
import TypingBar from "@/components/Sheets/TypingBar";

const Detail = () => {
  return (
    <Fragment>
      <Header />
      <Toolbar />
      <TypingBar />
      <GridTable />
    </Fragment>
  );
};

export default Detail;
