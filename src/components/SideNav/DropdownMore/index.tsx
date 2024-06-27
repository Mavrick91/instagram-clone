import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  AlignJustify,
  Bookmark,
  LucideIcon,
  Settings,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { logout } from "@/actions/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";

type Props = {
  displaySmallNav: boolean;
};

const DropdownMore = ({ displaySmallNav }: Props) => {
  const { toggleTheme } = useTheme();
  const user = useUserInfo();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const dropdownItems = [
    { label: "Settings", Icon: Settings },
    { label: "Your activity", Icon: Activity },
    { label: "Saved", Icon: Bookmark },
    { label: "Switch appearance", onClick: toggleTheme, Icon: Sun },
    { label: "Report a problem", Icon: AlertTriangle },
  ];

  const commonClasses =
    "flex cursor-pointer w-fill text-sm items-center space-x-4 rounded-lg p-4 hover:bg-ig-hover-overlay";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center rounded-2xl p-3 text-ig-primary-text hover:bg-ig-hover-overlay">
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
      <DropdownMenuContent className="absolute bottom-16 left-0 z-50 w-[266px] rounded-2xl bg-ig-banner-background shadow-custom">
        <div className="p-2 pb-0">
          {dropdownItems.map(({ label, Icon, onClick }) => {
            const ItemComponent = onClick ? "button" : "div";

            return (
              <ItemComponent
                key={label}
                className={commonClasses}
                onClick={onClick}
                type={onClick ? "button" : undefined}
              >
                {Icon && <Icon size={18} />}
                <span>{label}</span>
              </ItemComponent>
            );
          })}
        </div>
        <div className="my-2 h-[6px] bg-ig-stroke/30" />
        <div className="px-2 pb-2">
          <button type="button" className={commonClasses}>
            Switch accounts
          </button>
          <div className="my-2 h-[.5px] bg-ig-stroke/50" />
          <button
            type="button"
            onClick={handleLogout}
            className={commonClasses}
          >
            Log out
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMore;
