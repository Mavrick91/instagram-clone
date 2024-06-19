import { zodResolver } from "@hookform/resolvers/zod";
import { RefObject } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserInfo } from "@/providers/UserInfoProvider";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .transform((val) => val.trim()),
});

type CommentFormData = z.infer<typeof commentSchema>;

type Props = {
  pictureId: number;
  refetchCommentList: () => void;
  commentListRef: RefObject<HTMLDivElement>;
};

function PostCommentForm({
  pictureId,
  refetchCommentList,
  commentListRef,
}: Props) {
  const user = useUserInfo();

  // const [commentPicture] = useCreateComment();

  const { register, handleSubmit, reset, watch } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const content = watch("content");

  const onSubmit = async (data: CommentFormData) => {
    try {
      // await commentPicture({
      //   variables: {
      //     createCommentInput: {
      //       content: data.content,
      //       userId: user.id,
      //       pictureId,
      //     },
      //   },
      // });
      refetchCommentList();
      commentListRef.current?.scroll({
        top: 0,
        behavior: "smooth",
      });
      reset();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Separator elevated />
      <div className="flex min-h-12 items-center py-2 pl-2 pr-4">
        <TextareaAutosize
          className="w-full resize-none bg-transparent p-2 text-sm text-primary-text placeholder:text-secondary-text focus:outline-none"
          placeholder="Add a comment..."
          {...register("content")}
          maxRows={4}
        />
        <Button type="submit" variant="ghost" disabled={!content}>
          Post
        </Button>
      </div>
    </form>
  );
}

export default PostCommentForm;
