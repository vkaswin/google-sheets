import { Fragment } from "react";
import Header from "@/components/Header";
import FormularBar from "@/components/FormularBar";
import Grid from "@/components/Grid";
import BottomBar from "@/components/BottomBar";

import { IUser } from "@/types/User";

const SheetDetail = () => {
  const user: IUser = {
    _id: "1",
    email: "vkaswin@gmail.com",
    name: "Aswin Kumar",
  };

  const onLogout = () => {
    console.log("logout");
  };

  return (
    <Fragment>
      <Header user={user} onLogout={onLogout} />
      <FormularBar />
      <Grid />
      <BottomBar />
    </Fragment>
  );
};

export default SheetDetail;
