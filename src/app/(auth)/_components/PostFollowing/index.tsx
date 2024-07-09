import { getPictureDetails } from "@/actions/picture";
import getQueryClient from "@/lib/queryClient";
import { UserPictureDetails } from "@/types/picture";

import PostItem from "./PostItem";

type PostFollowingProps = {
  serverPicture: UserPictureDetails;
};

const PostFollowing = async ({ serverPicture }: PostFollowingProps) => {
  const queryClient = getQueryClient();
  const pictureDetails = await queryClient.ensureQueryData({
    queryKey: ["picture", serverPicture.id],
    queryFn: () => {
      return getPictureDetails(serverPicture.id);
    },
  });

  return (
    <div className="space-y-4">
      <PostItem serverPictureDetails={pictureDetails} />
    </div>
  );
};

export default PostFollowing;
