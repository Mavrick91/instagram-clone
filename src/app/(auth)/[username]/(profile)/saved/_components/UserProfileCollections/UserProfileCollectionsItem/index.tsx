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
      key={collection.name_id}
      prefetch
      className="relative col-span-1 grid aspect-square grid-cols-2 overflow-hidden rounded-md border border-ig-separator bg-gradient-to-t from-black/50 to-transparent hover:from-black/40"
      href={`/${profileUsername}/collection/${collection.id}`}
      type="button"
    >
      {collection.pictures.map((picture) => {
        return (
          <ImageClient
            key={picture.picture.id}
            priority
            alt="collection"
            className="col-span-1 aspect-square"
            height={150}
            src={picture.picture.sizes.small}
            width={150}
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
