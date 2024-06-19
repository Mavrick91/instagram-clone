import ImageClient from "@/components/ImageClient";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  picture: UserPictureDetails;
};

export default function PostPicture({ picture }: Props) {
  return (
    <div className="group relative col-span-1 aspect-square size-[512px] min-h-96 bg-highlight-background">
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
}
