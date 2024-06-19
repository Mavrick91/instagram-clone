"use client";

import * as user from "@/types/user";

import Modal from "../Modal";
import FollowersDialogItem from "./FollowersDialogItem";

type FollowersDialogProps = {
  followers: user.FollowerType[];
  isFollowers?: boolean;
};

export default function FollowersDialog({
  followers,
  isFollowers,
}: FollowersDialogProps) {
  return (
    <div
      className="flex max-h-[400px] min-h-[200px] w-[400px] flex-col gap-0 p-0"
      style={{
        maxWidth: "calc(100vw - 88px)",
      }}
    >
      <Modal.Header>
        <Modal.Header.Title>
          {isFollowers ? "Followers" : "Followings"}
        </Modal.Header.Title>
      </Modal.Header>

      <div className="overflow-y-auto">
        {followers.length ? (
          followers.map((follower: user.FollowerType) => {
            let user: user.FollowInitiatorOrTargetSelectType | undefined;

            if ("initiator" in follower) {
              user = follower.initiator;
            }
            if ("targetUser" in follower) {
              user = follower.targetUser;
            }

            if (!user) return null;

            return <FollowersDialogItem follower={user} key={user.id} />;
          })
        ) : (
          <p className="pt-6 text-center text-sm text-secondary-text">
            {isFollowers ? "No followers" : "No followings"}
          </p>
        )}
      </div>
    </div>
  );
}
