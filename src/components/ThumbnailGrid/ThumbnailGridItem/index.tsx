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
  const { openModal } = useModal();

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
        key={picture.id}
        className="group relative col-span-1 aspect-square overflow-hidden bg-ig-highlight-background"
        type="button"
        onClick={() => {
          return openModal("postDetailsDialog", { pictureId: picture.id });
        }}
      >
        <ImageClient
          priority
          alt={picture.alt_text || "Picture"}
          className="size-full overflow-hidden object-cover"
          height={317}
          src={picture.sizes.thumbnail}
          width={317}
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
