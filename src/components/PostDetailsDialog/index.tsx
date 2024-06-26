import { useQuery, useQueryClient } from "@tanstack/react-query";

import PostDetailsClient from "@/components/PostDetailsDialog/PostDetailsClient";
import PostDetailsHeader from "@/components/PostDetailsDialog/PostDetailsHeader";
import PostDetailsPicture from "@/components/PostDetailsDialog/PostDetailsPicture";
import { UserPictureDetails } from "@/types/picture";

import Separator from "../ui/separator";

export type PostDetailsDialogProps = {
  pictureId: number;
};

const PostDetailsDialog = ({ pictureId }: PostDetailsDialogProps) => {
  const queryClient = useQueryClient();
  const pictureCached = queryClient.getQueryData<UserPictureDetails>([
    "picture",
    pictureId,
  ])!;

  const { data: picture } = useQuery<UserPictureDetails>({
    queryKey: ["picture", pictureId],
    initialData: pictureCached,
  });

  if (!picture) {
    return null;
  }

  return (
    <div className="flex">
      <PostDetailsPicture picture={picture} />
      <div className="flex min-w-[405px] max-w-[500px] shrink-0 flex-col border-l border-post-separator bg-ig-primary-background">
        <PostDetailsHeader picture={picture} />
        <Separator post />
        <PostDetailsClient picture={picture} />
      </div>
    </div>
  );
};

export default PostDetailsDialog;
