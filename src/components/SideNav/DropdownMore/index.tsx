import { useClickOutside } from "@mantine/hooks";
import { motion } from "framer-motion";
import { AlignJustify, Bookmark, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { logout } from "@/actions/user";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";

type Props = {
  displaySmallNav: boolean;
};

const DropdownMore = ({ displaySmallNav }: Props) => {
  const { toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRef, setTriggerRef] = useState<HTMLDivElement | null>(null);
  const ref = useClickOutside(() => setIsOpen(false), null, [triggerRef]);
  const user = useUserInfo();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleRedirectSaved = () => {
    router.push(`/${user.username}/saved`);
  };

  const dropdownItems = [
    { label: "Saved", onClick: handleRedirectSaved, Icon: Bookmark },
    { label: "Switch appearance", onClick: toggleTheme, Icon: Sun },
  ];

  const commonClasses =
    "flex cursor-pointer w-fill text-sm items-center space-x-4 rounded-lg p-4 hover:bg-ig-hover-overlay";

  return (
    <div ref={setTriggerRef} className="relative">
      <button
        className="w-fill flex items-center rounded-lg p-3 text-ig-primary-text hover:bg-ig-hover-overlay"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AlignJustify />
        <motion.span
          animate={{ opacity: displaySmallNav ? 0 : 1 }}
          className={cn("ml-4", {
            "opacity-0 ml-0": displaySmallNav,
          })}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          {!displaySmallNav && "More"}
        </motion.span>
      </button>
      {isOpen && (
        <div
          ref={ref}
          className="absolute bottom-16 left-0 z-50 w-[266px] rounded-2xl bg-ig-banner-background shadow-custom"
        >
          <div className="p-2 pb-0">
            {dropdownItems.map(({ label, Icon, onClick }) => {
              return (
                <button
                  key={label}
                  className={commonClasses}
                  type="button"
                  onClick={() => {
                    onClick();
                    setIsOpen(false);
                  }}
                >
                  {Icon && <Icon size={18} />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
          <div className="my-2 h-[6px] bg-ig-stroke/30" />
          <div className="px-2 pb-2">
            <button
              className={commonClasses}
              type="button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMore;
