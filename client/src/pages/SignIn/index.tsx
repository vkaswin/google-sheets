import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/Input";

import styles from "./SignIn.module.scss";

const SignIn = () => {
  let {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<ISignIn>();

  let { signIn } = useAuth();

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  let handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") handleSubmit(signIn)();
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo}>
          <span>Sign In</span>
          <span>to continue</span>
        </div>
        <div className={styles.form}>
          <Input
            label="Email Id"
            errorType={errors?.email?.type}
            message={{
              required: "Please enter email",
              pattern: "Invalid Email",
            }}
            register={register("email", {
              required: true,
              pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            })}
          />
          <Input
            label="Password"
            type="password"
            errorType={errors?.password?.type}
            message={{
              required: "Please enter password",
            }}
            register={register("password", {
              required: true,
            })}
          />
          <div className={styles.cta}>
            <Link to="/auth/sign-up">Create Account</Link>
            <button onClick={handleSubmit(signIn)}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
