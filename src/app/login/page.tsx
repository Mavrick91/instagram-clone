"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";

import { login } from "@/actions/user";
import LoginForm from "@/app/login/_components/LoginForm";
import PhonePreview from "@/app/login/_components/PhonePreview";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const { mutate: mutateLogin, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginFormInputs) => {
      return login(data.email, data.password);
    },
    onSuccess: () => {
      router.replace("/");
    },
  });

  const handleChangeEmail = (email: string) => {
    setEmail(email);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutateLogin({ email, password: "test" });
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center space-y-4 bg-ig-primary-background">
      <article className="mx-auto flex max-w-polaris-site-width-wide items-center gap-8">
        <PhonePreview />
        <form
          className="w-[350px] space-y-4 border border-ig-elevated-separator px-10 py-8"
          onSubmit={onSubmit}
        >
          <LoginForm handleChangeEmail={handleChangeEmail} />
          <Button
            className="w-full"
            disabled={!email}
            loading={isPending}
            text="lg"
            type="submit"
            variant="primary"
          >
            Login
          </Button>
        </form>
      </article>
    </main>
  );
};

export default Login;
