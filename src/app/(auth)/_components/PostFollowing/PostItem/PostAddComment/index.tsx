"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

import { createComment } from "@/actions/comment";
import { Button } from "@/components/ui/button";
import { RevalidatePath } from "@/types/global";

const schema = z.object({
  comment: z.string().min(1, { message: "Comment is required" }),
});

type Inputs = z.infer<typeof schema>;

type Props = {
  pictureId: number;
  revalidatePath: RevalidatePath;
};

export default function PostAddComment({ pictureId, revalidatePath }: Props) {
  const { reset, register, handleSubmit, watch } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const watchComment = watch("comment");

  const onSubmit = async (data: Inputs) => {
    await createComment(pictureId, data.comment, revalidatePath);

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative mt-2 flex items-center"
    >
      <TextareaAutosize
        className="max-h-52 min-h-5 w-full resize-none bg-transparent pr-12 text-sm text-primary-text outline-none placeholder:text-secondary"
        placeholder="Add a comment"
        {...register("comment")}
        maxRows={4}
      />

      {watchComment && (
        <Button variant="ghost" type="submit">
          Post
        </Button>
      )}
    </form>
  );
}
