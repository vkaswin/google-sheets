import { Fragment } from "react";
import Header from "@/components/Header";
import Grid from "@/components/Grid";
import BottomBar from "@/components/BottomBar";

const SheetDetail = () => {
  const user: IUser = {
    _id: "1",
    email: "vkaswin@gmail.com",
    name: "Aswin Kumar",
    colorCode: "#4589eb",
  };

  const onLogout = () => {
    console.log("logout");
  };

  return (
    <Fragment>
      <Header user={user} onLogout={onLogout} />
      <Grid />
      <BottomBar />
    </Fragment>
  );
};

export default SheetDetail;
