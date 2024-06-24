import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getPictureDetails } from "@/actions/picture";
import getQueryClient from "@/lib/queryClient";
import { UserPictureDetails } from "@/types/picture";

import PostItem from "./PostItem";

type PostFollowingProps = {
  serverPicture: UserPictureDetails;
};

const PostFollowing = async ({ serverPicture }: PostFollowingProps) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["picture", serverPicture.id],
    queryFn: () => {
      return getPictureDetails(serverPicture.id);
    },
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="space-y-4">
      <HydrationBoundary state={dehydratedState}>
        <PostItem pictureId={serverPicture.id} />
      </HydrationBoundary>
    </div>
  );
};

export default PostFollowing;
