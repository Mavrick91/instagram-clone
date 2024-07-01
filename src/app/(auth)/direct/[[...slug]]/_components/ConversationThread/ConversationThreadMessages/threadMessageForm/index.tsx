"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createMessage } from "@/actions/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useUserInfo } from "@/providers/UserInfoProvider";

const schema = z.object({
  message: z.string(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  threadId: number;
  recipientId: number;
  senderId: number;
};
export const ThreadMessageForm = ({
  threadId,
  recipientId,
  senderId,
}: Props) => {
  const currentUser = useUserInfo();
  const { sendMessage } = useWebSocket();

  const { register, handleSubmit, watch, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
  });
  const messageWatch = watch("message");

  const onSubmit = async (data: FormData) => {
    const newMessage = await createMessage(
      data.message,
      currentUser.id,
      threadId,
    );
    sendMessage(recipientId, senderId, newMessage);
    reset({ message: "" });
  };

  return (
    <div className="m-4">
      <form className="relative" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex h-11 items-center">
          <Input
            {...register("message")}
            autoComplete="off"
            className="h-full rounded-full border border-ig-elevated-separator bg-ig-primary-background pl-6 text-[15px]"
            placeholder="Message..."
          />
        </div>
        <Button
          className="absolute right-5 top-1/2 -translate-y-1/2"
          disabled={!messageWatch}
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  );
};
