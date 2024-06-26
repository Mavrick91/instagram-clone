import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .transform((val) => {
      return val.trim();
    }),
});

type CommentFormData = z.infer<typeof commentSchema>;

type Props = {
  handleAddComment: (comment: string) => Promise<void>;
};

const PostCommentForm = ({ handleAddComment }: Props) => {
  const { register, handleSubmit, reset, watch } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const content = watch("content");

  const onSubmit = async (data: CommentFormData) => {
    reset();
    await handleAddComment(data.content);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Separator ig />
      <div className="flex min-h-12 items-center py-2 pl-2 pr-4">
        <TextareaAutosize
          className="w-full resize-none bg-transparent p-2 text-sm text-ig-primary-text placeholder:text-ig-secondary-text focus:outline-none"
          placeholder="Add a comment..."
          {...register("content")}
          maxRows={4}
        />
        <Button type="submit" padding="none" disabled={!content} text="sm">
          Post
        </Button>
      </div>
    </form>
  );
};

export default PostCommentForm;
