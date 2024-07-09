import moment from "moment";

import ButtonFollow from "@/components/ButtonFollow";
import ImageClient from "@/components/ImageClient";
import UserAvatar from "@/components/UserAvatar";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { PrismaNotification } from "@/types/notification";

type Props = {
  notification: PrismaNotification;
};

const NotificationItem = ({ notification }: Props) => {
  const renderContentBasedOnType = () => {
    switch (notification.type) {
      case "COMMENT":
        return (
          <>
            <div className="text-ig-primary-text">
              <span className="mr-1 font-semibold">
                {notification.sender.username}
              </span>
              <span className="text-sm">
                commented: {notification.comment?.content}
              </span>
            </div>
          </>
        );
      case "LIKE":
        return (
          <>
            <div className="text-ig-primary-text">
              <span className="mr-1 font-semibold">
                {notification.sender.username}
              </span>
              <span className="text-sm">liked your photo.</span>
            </div>
          </>
        );
      case "FOLLOW":
        return (
          <>
            <div className="text-ig-primary-text">
              <span className="mr-1 font-semibold">
                {notification.sender.username}
              </span>
              <span className="text-sm">started following you.</span>
            </div>
          </>
        );
      // Handle other types as necessary
      default:
        return null;
    }
  };

  const user = useUserInfo();

  const isFollowingCurrentProfile = user.initiated_follows.some(
    (follow) => follow.target_user_id === notification.sender.id,
  );

  return (
    <button
      className="flex w-full items-center px-6 py-2 text-left hover:bg-ig-hover-overlay"
      type="button"
    >
      <div className="mr-3 shrink-0">
        <UserAvatar avatar={notification.sender.avatar} width={44} />
      </div>
      <div className="flex w-full shrink items-center justify-between gap-7">
        <div className="text-sm">
          {renderContentBasedOnType()}{" "}
          <span className="text-ig-secondary-text">
            {moment(notification.created_at).fromNow()}
          </span>
        </div>
        {notification.type === "FOLLOW" ? (
          <ButtonFollow
            buttonProps={{
              variant: isFollowingCurrentProfile ? "gray" : "primary",
            }}
            isFollowing={isFollowingCurrentProfile}
            userProfileId={notification.sender.id}
            userProfileUsername={notification.sender.username}
          />
        ) : notification.picture ? (
          <div className="relative size-11 shrink-0">
            <ImageClient
              fill
              alt={notification.picture?.alt_text || "Picture commented"}
              className="aspect-square object-cover"
              src={notification.picture.sizes.small}
            />
          </div>
        ) : null}
      </div>
    </button>
  );
};
export default NotificationItem;
