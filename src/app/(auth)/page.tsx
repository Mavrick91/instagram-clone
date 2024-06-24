import { getFollowedUsersPictures } from "@/actions/picture";
import { getAllUsers, getCurrentUser } from "@/actions/user";
import PostItem from "@/app/(auth)/_components/PostFollowing/PostItem";

import PostFollowing from "./_components/PostFollowing";
import SuggestFollowList from "./_components/SuggestFollowList";

const HomePage = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser.initiatedFollows.length <= 3) {
    const allUsers = await getAllUsers();

    return <SuggestFollowList allUsers={allUsers} />;
  }

  const picturesFromFollowing = await getFollowedUsersPictures();

  return (
    <div className="mt-4">
      <div className="space-y-4">
        {picturesFromFollowing.map((picture) => {
          return <PostFollowing key={picture.id} serverPicture={picture} />;
        })}
      </div>
    </div>
  );
};

export default HomePage;
