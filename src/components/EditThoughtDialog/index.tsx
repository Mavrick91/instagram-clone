import { useRouter } from "next/navigation";
import { forwardRef } from "react";

import { deleteThought } from "@/actions/thought";
import BubbleThought from "@/components/BubbleThought";
import ImageClient from "@/components/ImageClient";
import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/providers/UserInfoProvider";

type Props = {
  onClose: () => void;
  followersOnly: boolean;
};

const EditThoughtDialog = forwardRef<HTMLDivElement, Props>(
  ({ onClose, followersOnly }, ref) => {
    const user = useUserInfo();
    const router = useRouter();

    const handleClickDelete = async () => {
      if (user.thought?.id) await deleteThought(user.thought.id);
      onClose();
    };

    const handleClickEdit = () => {
      router.push("/direct/thought");
      onClose();
    };

    return (
      <div ref={ref} className="absolute top-0 translate-x-[100px]">
        <div className="relative">
          <div className="flex">
            <div className="relative rounded-2xl bg-ig-banner-background shadow-ig">
              <div className="w-[350px]">
                <div className="flex justify-center py-8">
                  <div className="flex w-[230px] flex-col items-center">
                    <BubbleThought
                      canEdit={false}
                      bubbleText={user.thought?.content}
                    />
                    <div className="flex w-full flex-col items-center">
                      <div className="rounded-full">
                        <span className="pointer-events-none inset-0 block size-[160px] shrink-0 overflow-hidden rounded-full bg-secondary-background content-none">
                          <ImageClient
                            src={user.avatar!}
                            width={160}
                            height={160}
                            className="m-0 size-full border-0 object-cover p-0 align-baseline"
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="mt-2 w-full">
                        <span className="relative block min-w-0 max-w-full break-words text-center text-[20px] leading-6 text-ig-primary-text">
                          {user.username}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-3 mb-3 mt-0 flex flex-col items-center justify-center">
                  <div className="mb-2">
                    <span className="mb-1 text-center text-xs text-secondary">
                      {followersOnly
                        ? "Shared with followers that you follow back"
                        : "Shared with Close friends"}
                    </span>
                  </div>
                  <Button
                    onClick={handleClickEdit}
                    className="w-full font-semibold"
                  >
                    Leave a new note
                  </Button>
                  <Button
                    className="mt-2 w-full hover:text-primary-text"
                    size="sm"
                    variant="ghost"
                    onClick={handleClickDelete}
                  >
                    Delete note
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

EditThoughtDialog.displayName = "EditThoughtDialog";

export default EditThoughtDialog;
