type IUser = {
  _id: string;
  name: string;
  email: string;
  colorCode: string;
};

type ISignIn = {
  email: string;
  password: string;
};

type ISignUp = {
  name: string;
} & ISignIn;
