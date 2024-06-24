import Link from "next/link";

import { getCollectionsByUserId } from "@/actions/collection";
import ImageClient from "@/components/ImageClient";
import NewCollection from "@/components/NewCollection";

type UserProfileCollectionsProps = {
  userProfileId: number;
  username: string;
};

const UserProfileCollections = async ({
  userProfileId,
  username,
}: UserProfileCollectionsProps) => {
  const collections = await getCollectionsByUserId(userProfileId);

  const defaultCollection = collections.find((collection) => {
    return collection.isDefault;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {`Only you can see what you've saved`}
        </span>
        {defaultCollection && (
          <NewCollection defaultCollection={defaultCollection} />
        )}
      </div>
      <div>
        <div className="grid grid-cols-3 gap-1">
          {collections?.slice(0, 4).map((collection) => {
            return (
              <Link
                href={`/${username}/collection/${collection.nameId}`}
                key={collection.nameId}
                type="button"
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
          })}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCollections;
