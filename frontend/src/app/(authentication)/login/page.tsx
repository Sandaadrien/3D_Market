"use client";
import React, { useState } from "react";
import { AtSign, KeyRound, Chromium, Facebook, Github } from "lucide-react";
import Input from "@/components/Input";
import ButtonSignUp from "@/components/ButtonSignUp";
import Link from "next/link";
import toast from "react-hot-toast";
import { API_URL } from "@/utils/api";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Format de l'email invalide");
      return;
    }
    if (password === "") {
      toast.error("Password vide inaccetable");
      return;
    }
    const payload = {
      email,
      password,
    };
    try {
      const res = await fetch(`${API_URL}/Authentication/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Une erreur est survenue");
        return;
      }
      toast.success(data.message);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => router.push("/home"), 2000);
    } catch (error) {
      console.log(error);
      toast.error("Erreur de connexion vers le serveur");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-5 border border-gray-800/50 p-10 rounded-lg"
      >
        <h2 className="font-bold text-3xl">Login</h2>
        <div className="flex flex-col items-center gap-3 w-full">
          <Input
            inputType={{
              type: "email",
              icon: <AtSign className="text-gray-800" />,
              placeholder: "Email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
            }}
          />

          <Input
            inputType={{
              type: "password",
              icon: <KeyRound className="text-gray-800" />,
              placeholder: "Password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
            }}
          />
          <p className="w-full text-sm">Forgot your password ?</p>

          <button
            type="submit"
            className="w-full p-4 bg-gray-800 rounded-md border border-gray-800 text-gray-100 font-semibold cursor-pointer"
          >
            Sign in
          </button>
        </div>
        <div className="flex items-center justify-center gap-2">
          <hr className="w-10" />
          <p className="text-sm">or sign in with</p>
          <hr className="w-10" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <ButtonSignUp buttonParams={{ text: "Google", icon: <Chromium /> }} />
          <ButtonSignUp
            buttonParams={{ text: "Facebook", icon: <Facebook /> }}
          />
          <ButtonSignUp buttonParams={{ text: "Github", icon: <Github /> }} />
        </div>
        <p className="text-sm">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold" href="/signup">
            Request Now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
