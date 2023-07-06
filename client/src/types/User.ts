import { Dispatch, SetStateAction } from "react";

export interface IUser {
  _id: string;
  name: string;
  email: string;
}

export type ISignIn = {
  email: string;
  password: string;
};

export interface ISignUp extends ISignIn {
  name: string;
}

export interface IAuthResponse {
  message: string;
  token: string;
}

export interface AuthContextType {
  user?: IUser;
  setUser: Dispatch<SetStateAction<IUser | undefined>>;
  signIn: (data: ISignIn) => Promise<void>;
  signUp: (data: ISignUp) => Promise<void>;
  logout: () => void;
}
