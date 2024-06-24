import moment from "moment";

import PostCTA from "@/components/PostCTA";
import { UserPictureDetails } from "@/types/picture";

type PostDetailsCTAProps = {
  picture: UserPictureDetails;
};

const PostDetailsCTA = ({ picture }: PostDetailsCTAProps) => {
  return (
    <div className="border-t border-separator p-3 pt-1.5">
      <PostCTA showMessageIcon={false} pictureId={picture.id} key={2} />
      <span className="text-xs text-secondary">
        {moment(picture.createdAt).format("D MMMM YYYY")}
      </span>
    </div>
  );
};

export default PostDetailsCTA;
