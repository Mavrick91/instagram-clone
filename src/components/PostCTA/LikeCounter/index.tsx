import { Pluralize } from "@/components/Pluralize";

type LikeCounterProps = {
  hideLikesAndViewCounts: boolean;
  likes: Array<{ userId: number; user?: { username: string } }>;
  _count: { likes: number };
  pictureUser: { username: string };
  userId: number;
  handleToggleLike: () => void;
};

const LikeCounter = ({
  hideLikesAndViewCounts,
  likes,
  _count,
  pictureUser,
  userId,
  handleToggleLike,
}: LikeCounterProps) => {
  if (hideLikesAndViewCounts) {
    const userLiked = likes.some((like) => {
      return like.userId === userId;
    });
    if (userLiked) {
      return (
        <p className="text-sm">
          Liked by <b>{pictureUser.username}</b>
          {_count.likes > 1 && (
            <span>
              {" "}
              and <b>others</b>
            </span>
          )}
        </p>
      );
    }
    if (likes?.[0]?.user) {
      return (
        <p className="text-sm">
          Liked by <b>{likes[0].user.username}</b>
          {_count.likes > 1 && " and others"}
        </p>
      );
    }
    return null;
  }

  if (_count.likes) {
    return (
      <p className="text-sm font-semibold">
        <Pluralize count={_count.likes} singular="like" />
      </p>
    );
  }

  return (
    <p className="text-sm">
      Be the first one to{" "}
      <b>
        <button
          className="hover:text-ig-secondary-text"
          type="button"
          onClick={handleToggleLike}
        >
          like this
        </button>
      </b>
    </p>
  );
};

export default LikeCounter;
