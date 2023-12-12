import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { signInUser, signUpUser } from "@/services/User";
import { cookie } from "@/utils";

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

const AuthContext = createContext({} as IAuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
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
    navigate("/sheet/list");
  };

  let signIn = async (data: ISignIn) => {
    try {
      let {
        data: {
          data: { token },
        },
      } = await signInUser(data);
      handleAuthResponse(token);
    } catch (error: any) {
      toast.error(error?.message);
      if (error?.message === "User not exist") navigate("/auth/sign-up");
    }
  };

  let signUp = async (data: ISignUp) => {
    try {
      let {
        data: {
          data: { token },
        },
      } = await signUpUser(data);
      handleAuthResponse(token);
    } catch (error: any) {
      toast.error(error?.message);
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

export const useAuth = () => {
  return useContext(AuthContext);
};
