import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import ImageClient from "@/components/ImageClient";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  previewPicture: string;
};

const AccessibilityExpand = ({ previewPicture }: Props) => {
  const { register } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-ig-elevated-separator">
      <button
        className="flex w-full items-center justify-between px-3 py-4"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={cn({
            "font-semibold": isOpen,
          })}
        >
          Accessibility
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            <div className="px-3 text-xs text-zinc-500">
              Alt text describes your photos for people with visual impairments.
              Alt text will be automatically created for your photos or you can
              choose to write your own.
            </div>
            <div>
              <div className="px-3 py-4">
                <div className="flex items-center gap-3 rounded">
                  <ImageClient
                    alt="icon alt"
                    height={44}
                    src={previewPicture}
                    width={44}
                  />
                  <Input
                    className="h-full grow bg-transparent placeholder:text-ig-secondary-text"
                    placeholder="Write alt text..."
                    {...register("altText")}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessibilityExpand;
