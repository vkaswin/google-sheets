import axios from "./axios";
import { USER_URL } from "./config";

type IAuthResponse = {
  message: string;
  data: { token: string };
};

export const signInUser = (data: ISignIn) => {
  return axios<IAuthResponse>({
    url: `${USER_URL}/sign-in`,
    method: "post",
    data,
  });
};

export const signUpUser = (data: ISignUp) => {
  return axios<IAuthResponse>({
    url: `${USER_URL}/sign-up`,
    method: "post",
    data,
  });
};
