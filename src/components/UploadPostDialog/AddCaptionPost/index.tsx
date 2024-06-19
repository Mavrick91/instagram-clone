import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

import UserAvatar from "@/components/UserAvatar";
import { useUserInfo } from "@/providers/UserInfoProvider";

import AccessibilityExpand from "./AccessibilityExpand";
import AdvancedSettingsExpand from "./AdvancedSettingsExpand";

type Props = {
  previewPicture: string;
  isEdit: boolean;
};

export default function AddCaptionPost({ previewPicture, isEdit }: Props) {
  const user = useUserInfo();
  const { register, watch } = useFormContext();

  const descriptionWatch = watch("description") || "";

  return (
    <div className="flex">
      <img
        src={previewPicture}
        className="aspect-square w-full max-w-[755px] object-cover"
      />
      <motion.div
        className="border-l border-elevated-separator"
        initial={{ width: 0 }}
        animate={{ width: "507px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-4 mb-3 mt-4">
          <div className="flex items-center gap-3">
            <UserAvatar avatar={user.avatar} size="size-7" />
            <div className="text-sm font-semibold">{user.username}</div>
          </div>
        </div>
        <div>
          <TextareaAutosize
            className="w-full resize-none bg-transparent px-4 text-primary-text focus:outline-none"
            placeholder="Write a caption..."
            {...register("description")}
            minRows={7}
            maxRows={7}
          />
        </div>
        <div className="flex h-11 items-center justify-end border-b border-elevated-separator px-4 text-xs text-secondary">
          {descriptionWatch.length}/2,200
        </div>
        <AccessibilityExpand previewPicture={previewPicture} />
        {!isEdit && <AdvancedSettingsExpand />}
      </motion.div>
    </div>
  );
}
