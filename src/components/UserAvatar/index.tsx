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
      style={{
        width: `${width}px`,
      }}
      className="relative flex aspect-square shrink-0 overflow-hidden rounded-full after:absolute after:inset-0 after:z-10 after:rounded-full after:border after:border-ig-avatar-border after:bg-ig-secondary-background"
    >
      <ImageClient
        className="z-50"
        src={avatarImage}
        alt="Profile picture"
        width={width}
        height={width}
      />
    </div>
  );
};

export default UserAvatar;
