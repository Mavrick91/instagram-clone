"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createThought, updateThought } from "@/actions/thought";
import BubbleThought from "@/components/BubbleThought";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { useUserInfo } from "@/providers/UserInfoProvider";

const schema = z.object({
  thought: z.string().transform((val) => {
    return val.trim();
  }),
});

type FormData = z.infer<typeof schema>;

const UpdateNote = () => {
  const user = useUserInfo();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      thought: "",
    },
  });

  const { thought: thoughtWatch } = form.watch();

  const handleSubmit = async (data: FormData) => {
    const { thought } = data;

    if (user.thought) {
      await updateThought(user.thought.id, thought);
    } else {
      await createThought(thought, user.id);
    }

    router.push("/direct/inbox");
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex w-full items-center justify-between border-b border-ig-separator p-4 py-5">
          <button onClick={() => router.push("/direct/inbox")}>
            <X />
          </button>
          <h2 className="text-xl font-bold">New note</h2>
          <Button
            className={cn("!opacity-0 font-semibold", {
              "!opacity-100": thoughtWatch,
            })}
            disabled={!thoughtWatch}
            padding="none"
            type="submit"
          >
            Share
          </Button>
        </div>
        <main className="flex grow flex-col items-center justify-center">
          <div className="relative flex flex-col items-center">
            <BubbleThought
              canEdit
              bubbleText="Share a thought..."
              register={form.register}
              size="big"
              thoughtWatch={thoughtWatch}
            />
            <UserAvatar avatar={user.avatar} width={160} />
          </div>
          {thoughtWatch.length >= 55 && (
            <span className="text-ig-error-or-destructive">
              {thoughtWatch.length} / 60
            </span>
          )}
        </main>
      </form>
    </Form>
  );
};

export default UpdateNote;
