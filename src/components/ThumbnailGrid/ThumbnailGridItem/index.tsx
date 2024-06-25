"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { memo } from "react";

import { getPictureDetails } from "@/actions/picture";
import ImageClient from "@/components/ImageClient";
import { useModal } from "@/providers/ModalProvider";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  initialPicture: UserPictureDetails;
};

const ThumbnailGridItem = ({ initialPicture }: Props) => {
  const { showModal } = useModal();

  const { data: picture } = useQuery<UserPictureDetails>({
    queryKey: ["picture", initialPicture.id],
    queryFn: () => {
      return getPictureDetails(initialPicture.id);
    },
    initialData: initialPicture,
  });

  if (!picture) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          return showModal("PostDetails", { pictureId: picture.id });
        }}
        key={picture.id}
        className="group relative col-span-1 aspect-square overflow-hidden bg-highlight-background"
      >
        <ImageClient
          width={317}
          height={317}
          alt={picture.altText || "Picture"}
          className="size-full overflow-hidden object-cover"
          src={picture.sizes.thumbnail}
          priority
        />
        <div className="absolute inset-0 z-20 hidden items-center justify-center gap-3 bg-black/50  text-white group-hover:flex">
          <MessageCircle fill="white" size={32} />
          <span className="text-2xl">{picture._count?.comments}</span>
        </div>
      </button>
    </>
  );
};

export default memo(ThumbnailGridItem);
