import { ReactNode, ChangeEventHandler } from "react";
interface InputInterface {
  type: "text" | "password" | "email";
  icon: ReactNode;
  placeholder: string;
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
interface ButtonSignUpType {
  text: string;
  icon: ReactNode;
}

export type { InputInterface, ButtonSignUpType };
