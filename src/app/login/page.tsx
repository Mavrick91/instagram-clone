"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { login } from "@/actions/user";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import LoginForm from "./_components/LoginForm";
import LoginMode from "./_components/LoginMode";
import MockedForm from "./_components/MockedForm";

const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => {
      return val.trim().toLowerCase();
    }),
  password: z.string().min(1, "Password must not be empty"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const [loginChoice, setLoginChoice] = useState<"custom" | "mocked">("custom");
  const router = useRouter();
  const {
    mutate: mutateLogin,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginFormInputs) => {
      return login(data.email, data.password);
    },
    onSuccess: () => {
      router.replace("/");
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    mutateLogin(data);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center space-y-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2 text-center">
          <div />
          <h1 className="text-3xl font-bold">Login</h1>
        </div>
        <LoginMode setLoginChoice={setLoginChoice} loginChoice={loginChoice} />
        {!!error && (
          <Alert id="error-message" variant="destructive">
            <p>{error.message}</p>
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            {loginChoice === "mocked" ? (
              <MockedForm setValue={setValue} />
            ) : (
              <LoginForm register={register} errors={errors} />
            )}
          </div>
          <Button className="w-full" type="submit" loading={isPending}>
            Login
          </Button>
        </form>
        <div className="flex items-center">
          <Link className="ml-auto text-sm underline" href="/register">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Login;
