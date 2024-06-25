import Link from "next/link";

import ImageClient from "@/components/ImageClient";
import { LightCollectionByUserId } from "@/types/collection";

type UserProfileCollectionsItemProps = {
  profileUsername: string;
  collection: LightCollectionByUserId;
};

const UserProfileCollectionsItem = ({
  profileUsername,
  collection,
}: UserProfileCollectionsItemProps) => {
  return (
    <Link
      href={`/${profileUsername}/collection/${collection.nameId}`}
      key={collection.nameId}
      type="button"
      prefetch
      className="relative col-span-1 grid aspect-square grid-cols-2 overflow-hidden rounded-md border border-separator bg-gradient-to-t from-black/50 to-transparent hover:from-black/40"
    >
      {collection.pictures.map((picture) => {
        return (
          <ImageClient
            key={picture.picture.id}
            className="col-span-1 aspect-square"
            src={picture.picture.sizes.small}
            alt="collection"
            priority
            width={150}
            height={150}
          />
        );
      })}
      <h2 className="absolute bottom-5 left-5 text-xl text-white">
        {collection.name}
      </h2>
    </Link>
  );
};

export default UserProfileCollectionsItem;
