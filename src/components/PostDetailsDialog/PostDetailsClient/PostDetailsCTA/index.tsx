import moment from "moment";

import PostCTA from "@/components/PostCTA";
import { UserPictureDetails } from "@/types/picture";

type PostDetailsCTAProps = {
  picture: UserPictureDetails;
};

const PostDetailsCTA = ({ picture }: PostDetailsCTAProps) => {
  return (
    <div className="border-t border-post-separator p-3 pt-1.5">
      <PostCTA key={2} pictureId={picture.id} showMessageIcon={false} />
      <span className="text-xs text-ig-secondary-text">
        {moment(picture.createdAt).format("D MMMM YYYY")}
      </span>
    </div>
  );
};

export default PostDetailsCTA;
