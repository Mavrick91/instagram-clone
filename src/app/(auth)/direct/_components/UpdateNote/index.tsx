"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuTrigger, RadioGroup } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createThought, updateThought } from "@/actions/thought";
import BubbleThought from "@/components/BubbleThought";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroupItem } from "@/components/ui/radio-group";
import UserAvatar from "@/components/UserAvatar";
import { useUserInfo } from "@/providers/UserInfoProvider";

const schema = z.object({
  thought: z.string().transform((val) => {
    return val.trim();
  }),
  visibility: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const activeShareOptions = [
  { label: "Followers that you follow back", value: "FOLLOWERS" },
  { label: "Close friends", value: "CLOSE_FRIENDS" },
];

const UpdateNote = () => {
  const user = useUserInfo();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      thought: "",
      visibility: "FOLLOWERS",
    },
  });

  const { thought: thoughtWatch, visibility: visibilityWatch } = form.watch();

  const handleSubmit = async (data: FormData) => {
    const { thought, visibility } = data;

    if (user.thought) {
      await updateThought(
        user.thought.id,
        thought,
        visibility as "FOLLOWERS" | "CLOSE_FRIENDS",
      );
    } else {
      await createThought(
        thought,
        user.id,
        visibility as "FOLLOWERS" | "CLOSE_FRIENDS",
      );
    }

    router.push("/direct/inbox");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col"
      >
        <div className="flex w-full items-center justify-between border-b border-separator p-4 py-5">
          <button
            onClick={() => {
              return router.push("/direct/inbox");
            }}
          >
            <X />
          </button>
          <h2 className="text-xl font-bold">New note</h2>
          {thoughtWatch ? (
            <Button variant="ghost" type="submit" className="font-semibold">
              Share
            </Button>
          ) : (
            <div />
          )}
        </div>
        <main className="flex grow flex-col items-center justify-center">
          <div className="relative">
            <BubbleThought
              size="big"
              bubbleText="Share a thought..."
              canEdit
              register={form.register}
              thoughtWatch={thoughtWatch}
            />
            <UserAvatar avatar={user.avatar} size="size-40" />
          </div>
          {thoughtWatch.length >= 55 && (
            <span className="text-destructive">{thoughtWatch.length} / 60</span>
          )}

          <div className="mt-24" />

          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger>
              <button className="flex items-center gap-x-1 text-sm text-primary-text">
                <Users size={14} /> <span>Shared with</span>{" "}
                <b>
                  {activeShareOptions.find((option) => {
                    return option.value === visibilityWatch;
                  })?.label || "Followers that you follow back"}
                </b>{" "}
                <ChevronDown size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full rounded-lg bg-white px-4 py-1 shadow-ig">
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            setDropdownOpen(false);
                          }}
                          defaultValue={field.value}
                          className="flex flex-col gap-0"
                        >
                          {activeShareOptions.map(({ value, label }) => {
                            return (
                              <FormItem
                                key={value}
                                className="block gap-x-2 py-3"
                              >
                                <FormControl>
                                  <RadioGroupItem value={value} />
                                </FormControl>
                                <FormLabel className="ml-3 mt-0 text-base font-normal">
                                  {label}
                                </FormLabel>
                              </FormItem>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </main>
      </form>
    </Form>
  );
};

export default UpdateNote;
