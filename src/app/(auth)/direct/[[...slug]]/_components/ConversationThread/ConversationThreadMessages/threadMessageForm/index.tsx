"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createMessage } from "@/actions/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserInfo } from "@/providers/UserInfoProvider";

const schema = z.object({
  message: z.string(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  threadId: number;
};
export const ThreadMessageForm = ({ threadId }: Props) => {
  const user = useUserInfo();

  const { register, handleSubmit, watch, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const messageWatch = watch("message");

  const onSubmit = async (data: FormData) => {
    await createMessage(data.message, user.id, threadId);
    reset();
  };

  return (
    <div className="m-4">
      <form className="relative" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex h-11 items-center">
          <Input
            {...register("message")}
            placeholder="Message..."
            className="h-full rounded-full bg-primary-background pl-6 text-[15px]"
            autoComplete="off"
          />
        </div>
        <Button
          variant="ghost"
          type="submit"
          disabled={!messageWatch}
          className="absolute right-5 top-1/2 -translate-y-1/2"
        >
          Send
        </Button>
      </form>
    </div>
  );
};
