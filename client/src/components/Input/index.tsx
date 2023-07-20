import { ComponentProps } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import styles from "./Input.module.scss";

type InputProps = {
  label: string;
  errorType?: string;
  message?: Record<string, string>;
  register: UseFormRegisterReturn;
} & ComponentProps<"input">;

const Input = ({
  label,
  errorType,
  message,
  type = "text",
  placeholder = "Enter here",
  register,
  ...rest
}: InputProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.input_field} aria-invalid={!!errorType}>
        <label>{label}</label>
        <input type={type} placeholder={placeholder} {...rest} {...register} />
      </div>
      {errorType && (
        <div className={styles.error_msg}>
          <i className="bx-error-circle"></i>
          <span>{message?.[errorType]}</span>
        </div>
      )}
    </div>
  );
};

export default Input;
