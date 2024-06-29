"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import useUpdateComment from "@/hooks/useUpdateComment";

const schema = z.object({
  comment: z.string().min(1, { message: "Comment is required" }),
});

type Inputs = z.infer<typeof schema>;

type Props = {
  pictureId: number;
  pictureUserId: number;
};

const PostAddComment = ({ pictureId, pictureUserId }: Props) => {
  const { reset, register, handleSubmit, watch } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const watchComment = watch("comment");
  const { handleCreateComment } = useUpdateComment(pictureId, pictureUserId);

  const onSubmit = async (data: Inputs) => {
    reset();
    await handleCreateComment(data.comment);
  };

  return (
    <form
      className="relative mt-2 flex items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextareaAutosize
        className="max-h-52 min-h-5 w-full resize-none bg-transparent pr-12 text-sm text-ig-primary-text outline-none placeholder:text-ig-secondary-text"
        placeholder="Add a comment"
        {...register("comment")}
        maxRows={4}
      />

      {watchComment && (
        <Button padding="none" text="sm" type="submit">
          Post
        </Button>
      )}
    </form>
  );
};

export default PostAddComment;
