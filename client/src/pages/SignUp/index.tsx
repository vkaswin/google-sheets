import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/Input";
import { getStaticUrl } from "@/utils";

import styles from "./SignUp.module.scss";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  let {
    formState: { errors },
    register,
    getValues,
    handleSubmit,
  } = useForm<FormData>();

  let { signUp } = useAuth();

  let [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  let handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") handleSubmit(onSubmit)();
  };

  let onSubmit = ({ firstName, lastName, email, password }: FormData) => {
    let body = {
      name: `${firstName} ${lastName}`,
      email,
      password,
    };
    signUp(body);
  };

  let handleCheckBox = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo}>
          <span>Create your Account</span>
        </div>
        <div className={styles.form}>
          <div className={styles.wrap_field}>
            <Input
              label="First name"
              errorType={errors?.firstName?.type}
              message={{
                required: "Please enter first name",
                pattern: "First name should contains alphabets only",
                minLength: "First name should contains atleast 3 characters",
              }}
              register={register("firstName", {
                required: true,
                pattern: /^[A-Za-z ]+$/,
                minLength: 3,
              })}
            />
            <Input
              label="Last name"
              errorType={errors?.lastName?.type}
              message={{
                required: "Please enter last name",
                pattern: "Last name should contains alphabets only",
                minLength: "Last name should contains atleast 3 characters",
              }}
              register={register("lastName", {
                required: true,
                pattern: /^[A-Za-z ]+$/,
                minLength: 3,
              })}
            />
          </div>
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
          <div className={styles.password_field}>
            <div className={styles.wrap_field}>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                errorType={errors?.password?.type}
                message={{
                  required: "Please enter password",
                  pattern: "Pattern mismatch",
                }}
                register={register("password", {
                  required: true,
                  pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                })}
              />
              <Input
                label="Confirm"
                type={showPassword ? "text" : "password"}
                errorType={errors?.confirmPassword?.type}
                message={{
                  required: "Please enter confirm password",
                  validate: "Confirm password is not match with password",
                }}
                register={register("confirmPassword", {
                  required: true,
                  validate: (value) => value === getValues("password"),
                })}
              />
            </div>
            <span className={styles.password_note}>
              Use 8 or more characters with a mix of letters, numbers, uppercase
              & symbols
            </span>
            <div className={styles.show_field}>
              <input
                id="show-password"
                type="checkbox"
                checked={showPassword}
                onChange={handleCheckBox}
              />
              <label htmlFor="show-password">Show password</label>
            </div>
          </div>
          <div className={styles.cta}>
            <Link to="/auth/sign-in">Sign in instead</Link>
            <button onClick={handleSubmit(onSubmit)}>Create Account</button>
          </div>
        </div>
      </div>
      <div className={styles.poster}>
        <img src={getStaticUrl("/account.svg")} alt="" />
      </div>
    </div>
  );
};

export default SignUp;
