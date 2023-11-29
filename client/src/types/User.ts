type IUser = {
  _id: string;
  name: string;
  email: string;
};

type ISignIn = {
  email: string;
  password: string;
};

type ISignUp = {
  name: string;
} & ISignIn;

type IAuthResponse = {
  message: string;
  token: string;
};
