import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type Props = {
  displaySmallNav: boolean;
};

const SideNavLogo = ({ displaySmallNav }: Props) => {
  return (
    <Link
      className="mb-5 flex h-[73px] w-full items-center justify-center"
      href="/"
    >
      <motion.div
        animate={{ opacity: displaySmallNav ? 1 : 0 }}
        className={cn({
          "p-3 w-full text-ig-primary-text text-black flex items-center hover:bg-ig-hover-overlay rounded-md hover:scale-[1.1] transition-all":
            displaySmallNav,
        })}
        exit={{ display: "none" }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        {displaySmallNav && (
          <div>
            <Instagram className="text-ig-primary-text" />
          </div>
        )}
      </motion.div>
      <motion.div
        animate={{ opacity: displaySmallNav ? 0 : 1 }}
        className="h-20 justify-center whitespace-nowrap pb-4 pt-6 text-3xl font-semibold text-ig-primary-text"
        initial={{ opacity: 0 }}
        style={{
          fontFamily: "Dancing script",
        }}
        transition={{ delay: 0.2 }}
      >
        {!displaySmallNav && <span>{`Instagram Clone`}</span>}
      </motion.div>
    </Link>
  );
};

export default SideNavLogo;
