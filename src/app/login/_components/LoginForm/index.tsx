import { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";

type FormData = {
  email: string;
  password: string;
};

type Props = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
};

const LoginForm = ({ register, errors }: Props) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          {...register("email")}
          error={errors.email?.message}
          id="email"
          label="Email"
          placeholder="m@example.com"
          type="email"
        />
      </div>
      <div className="space-y-2">
        <Input
          required
          id="password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
          label="Password"
          placeholder="********"
        />
      </div>
    </div>
  );
};

export default LoginForm;
