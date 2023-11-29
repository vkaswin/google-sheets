import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { signInUser, signUpUser } from "@/services/User";
import { cookie } from "@/utils";
import { toast } from "react-toastify";

type AuthProviderProps = {
  children: ReactNode;
};

type IAuthContext = {
  user?: IUser;
  setUser: Dispatch<SetStateAction<IUser | undefined>>;
  signIn: (data: ISignIn) => Promise<void>;
  signUp: (data: ISignUp) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext({} as IAuthContext);

const AuthProvider = ({ children }: AuthProviderProps) => {
  let [user, setUser] = useState<IUser>();

  let navigate = useNavigate();

  useEffect(() => {
    let authToken = cookie.get("auth_token");
    authToken && setUser(jwtDecode<IUser>(authToken));
    document.addEventListener("unauthorized", logout);
    return () => {
      document.removeEventListener("unauthorized", logout);
    };
  }, []);

  let handleAuthResponse = (token: string) => {
    cookie.set({ name: "auth_token", value: token, days: 14 });
    setUser(jwtDecode<IUser>(token));
    navigate("/sheets/123");
  };

  let signIn = async (data: ISignIn) => {
    try {
      let {
        data: { token },
      } = await signInUser(data);
      handleAuthResponse(token);
    } catch (err: any) {
      toast.error(err?.message);
      if (err?.message === "User not exist") navigate("/auth/sign-up");
    }
  };

  let signUp = async (data: ISignUp) => {
    try {
      let {
        data: { token },
      } = await signUpUser(data);
      handleAuthResponse(token);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let logout = () => {
    cookie.remove("auth_token");
    navigate("/");
    setUser(undefined);
  };

  let context: IAuthContext = {
    user,
    setUser,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
