import { motion } from "framer-motion";
import {
  AlignJustify,
  Bookmark,
  OctagonAlert,
  Settings2,
  SquareActivity,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

import { logout } from "@/actions/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";

type Props = {
  displaySmallNav: boolean;
};

export default function DropdownMore({ displaySmallNav }: Props) {
  const { toggleTheme } = useTheme();
  const user = useUserInfo();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const dropdownItems = [
    {
      name: "Settings",
      Icon: Settings2,
    },
    {
      name: "Your activity",
      Icon: SquareActivity,
    },
    {
      name: "Saved",
      Icon: Bookmark,
    },
    {
      name: "Switch appearance",
      onClick: toggleTheme,
      Icon: Sun,
    },
    {
      name: "Report a problem",
      Icon: OctagonAlert,
    },
    {
      name: "Switch accounts",
      onClick: () => router.push(`/profile/${user.id}`),
    },
    {
      name: "Log out",
      onClick: handleLogout,
      className: "text-red-500 p-4",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center rounded-lg p-3 text-primary-text hover:bg-hover-overlay">
          <AlignJustify />
          <motion.span
            className={cn("ml-4", {
              "opacity-0 ml-0": displaySmallNav,
            })}
            initial={{ opacity: 0 }}
            animate={{ opacity: displaySmallNav ? 0 : 1 }}
            transition={{ delay: 0.2 }}
          >
            {!displaySmallNav && "More"}
          </motion.span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-5 w-[266px] rounded-2xl">
        {dropdownItems.map(({ name, Icon, onClick }) => {
          return (
            <Fragment key={name}>
              {name === "Log out" && <DropdownMenuSeparator />}
              <DropdownMenuItem
                className="cursor-pointer rounded-lg p-4 hover:bg-hover-overlay"
                onClick={onClick}
              >
                <div className="flex items-center gap-2">
                  {Icon ? <Icon /> : null}
                  {name}
                </div>
              </DropdownMenuItem>
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
