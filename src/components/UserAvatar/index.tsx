"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  avatar?: string | null;
  username?: string;
  size: string;
  onClick?: () => void;
};

const UserAvatar = ({ avatar, username, size, onClick }: Props) => {
  const avatarImage = avatar ?? "/placeholder-avatar.png";
  const isLink = !!username;
  const isButton = !!onClick;

  const baseClassName = `${size} after:size-${size} after:bg-secondary-background shrink-0 flex after:border after:border-border-avatar after:absolute after:inset-0 after:z-10 relative after:rounded-full`;
  const imageClassName = "w-full h-full rounded-full shrink-0 z-20 relative";

  const renderAvatar = () => {
    return (
      <Image
        src={avatarImage}
        alt={username ? `${username} profile picture` : "User posts picture"}
        className={imageClassName}
        width={24}
        height={24}
      />
    );
  };

  if (isLink) {
    return (
      <Link href={`/${username}`} className={baseClassName}>
        {renderAvatar()}
      </Link>
    );
  }

  if (isButton) {
    return (
      <button onClick={onClick} className={baseClassName}>
        {renderAvatar()}
      </button>
    );
  }

  return <div className={baseClassName}>{renderAvatar()}</div>;
};

export default UserAvatar;
