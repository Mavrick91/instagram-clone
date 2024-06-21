import { getFollowings } from "@/actions/follow";
import { getFollowedUsersPictures } from "@/actions/picture";
import { getAllUsers } from "@/actions/user";

import PostFollowing from "./_components/PostFollowing";
import SuggestFollowList from "./_components/SuggestFollowList";

const HomePage = async () => {
  const [allUsers, followings] = await Promise.all([
    getAllUsers(),
    getFollowings(),
  ]);

  if (followings.length <= 3) {
    return <SuggestFollowList allUsers={allUsers} followings={followings} />;
  }

  const picturesFromFollowing = await getFollowedUsersPictures();

  return (
    <div className="mt-4">
      <PostFollowing
        picturesFromFollowing={picturesFromFollowing}
        followings={followings}
      />
    </div>
  );
};

export default HomePage;
