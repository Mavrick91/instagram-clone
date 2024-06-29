"use client";

import ImageClient from "@/components/ImageClient";

type Props = {
  avatar?: string | null;
  width: number;
};

const UserAvatar = ({ avatar, width }: Props) => {
  const avatarImage = avatar ?? "/placeholder-avatar.png";

  return (
    <div
      className="relative flex aspect-square shrink-0 overflow-hidden rounded-full after:absolute after:inset-0 after:z-10 after:rounded-full after:border after:border-ig-avatar-border after:bg-ig-secondary-background"
      style={{
        width: `${width}px`,
      }}
    >
      <ImageClient
        alt="Profile picture"
        className="z-30"
        height={width}
        src={avatarImage}
        width={width}
      />
    </div>
  );
};

export default UserAvatar;
