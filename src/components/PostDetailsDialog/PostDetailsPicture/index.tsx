import ImageClient from "@/components/ImageClient";
import { UserPictureDetails } from "@/types/picture";

type PostDetailsPictureProps = {
  picture: UserPictureDetails;
};

const PostDetailsPicture = ({ picture }: PostDetailsPictureProps) => {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div
        className="relative aspect-[1440/1607] max-h-[665px] max-w-[596px] basis-[595.893px]"
        style={{
          width: "calc(100dvw - 460px)",
          height: "calc(100vh - 40px)",
        }}
      >
        <ImageClient
          fill
          priority
          alt={picture.altText || "Post image"}
          src={picture.sizes.original}
        />
      </div>
    </div>
  );
};

export default PostDetailsPicture;
