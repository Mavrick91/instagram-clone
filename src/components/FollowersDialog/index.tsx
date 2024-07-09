"use client";

import * as user from "@/types/user";
import { FollowerType } from "@/types/user";

import Modal from "../Modal";
import FollowersDialogItem from "./FollowersDialogItem";

export type FollowersDialogProps = {
  followers: FollowerType[];
  isFollowers?: boolean;
};

const FollowersDialog = ({ followers, isFollowers }: FollowersDialogProps) => {
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
          followers.map((follower: FollowerType) => {
            let user: user.FollowInitiatorOrTargetSelectType | undefined;

            if ("initiator" in follower) {
              user = follower.initiator;
            }
            if ("target_user" in follower) {
              user = follower.target_user;
            }

            if (!user) return null;

            return <FollowersDialogItem key={user.id} follower={user} />;
          })
        ) : (
          <p className="pt-6 text-center text-sm text-ig-secondary-text">
            {isFollowers ? "No followers" : "No followings"}
          </p>
        )}
      </div>
    </div>
  );
};

export default FollowersDialog;
