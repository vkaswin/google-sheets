import axios from "./axios";
import { User } from "./config";

export const signInUser = (data: ISignIn) => {
  return axios<IAuthResponse>({
    url: User.signIn,
    method: "post",
    data,
  });
};

export const signUpUser = (data: ISignUp) => {
  return axios<IAuthResponse>({
    url: User.signUp,
    method: "post",
    data,
  });
};
