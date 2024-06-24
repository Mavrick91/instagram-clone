import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const AdvancedSettingsExpand = () => {
  const form = useFormContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-elevated-separator">
      <button
        type="button"
        onClick={() => {
          return setIsOpen(!isOpen);
        }}
        className="flex w-full items-center justify-between px-3 py-4"
      >
        <div
          className={cn({
            "font-semibold": isOpen,
          })}
        >
          Advanced Settings
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-4 px-3">
                Hide like and view counts on this post
                <FormField
                  control={form.control}
                  name="hideLikesAndViewCounts"
                  render={({ field }) => {
                    return (
                      <FormControl>
                        <Switch
                          {...field}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    );
                  }}
                />
              </div>
              <div className="p-3 text-xs text-zinc-500">
                {`Only you will see the total number of likes and views on this
                  post. You can change this later by going to the ··· menu at the
                  top of the post. To hide like counts on other people's posts, go
                  to your account settings.`}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-4 px-3">
                Turn off commenting
                <FormField
                  control={form.control}
                  name="disableComments"
                  render={({ field }) => {
                    return (
                      <FormControl>
                        <Switch
                          {...field}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={cn({
                            "!bg-black": field.value,
                          })}
                        />
                      </FormControl>
                    );
                  }}
                />
              </div>
              <div className="p-3 text-xs text-zinc-500">
                You can change this later by going to the ··· menu at the top of
                your post.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSettingsExpand;
