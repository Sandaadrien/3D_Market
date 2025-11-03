"use client";
import type { InputInterface } from "@/types/components";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({ inputType }: { inputType: InputInterface }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = inputType.type === "password";
  const inputFieldType =
    isPasswordType && showPassword ? "text" : inputType.type;

  return (
    <span className="w-full relative flex items-center justify-center p-1.5 px-4 rounded-md border border-gray-800/50">
      {inputType.icon}
      <input
        type={inputFieldType}
        className="p-2 outline-0 flex-1 bg-transparent"
        placeholder={inputType.placeholder}
        required
        value={inputType.value ?? ""}
        onChange={inputType.onChange ?? (() => {})}
      />
      {isPasswordType && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="ml-2 text-gray-500 focus:outline-none cursor-pointer"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      )}
    </span>
  );
};

export default Input;
