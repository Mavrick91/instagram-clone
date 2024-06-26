import ImageClient from "@/components/ImageClient";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  picture: UserPictureDetails;
};

const PostPicture = ({ picture }: Props) => {
  return (
    <div className="group relative col-span-1 aspect-square size-[512px] min-h-96 bg-ig-highlight-background">
      <div className="mb-1">
        <ImageClient
          alt="user post picture"
          className="w-full"
          fill
          priority
          src={picture.sizes.medium}
        />
      </div>
    </div>
  );
};

export default PostPicture;
