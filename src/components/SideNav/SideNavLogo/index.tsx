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
      href="/"
      className="mb-5 flex h-[73px] w-full items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: displaySmallNav ? 1 : 0 }}
        transition={{ delay: 0.2 }}
        className={cn({
          "p-3 w-full text-primary-text text-black flex items-center hover:bg-hover-overlay rounded-md hover:scale-[1.1] transition-all":
            displaySmallNav,
        })}
        exit={{ display: "none" }}
      >
        {displaySmallNav && (
          <div>
            <Instagram className="text-primary-text" />
          </div>
        )}
      </motion.div>
      <motion.div
        className="h-20 justify-center whitespace-nowrap pb-4 pt-6 text-3xl font-semibold text-primary-text"
        style={{
          fontFamily: "Dancing script",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: displaySmallNav ? 0 : 1 }}
        transition={{ delay: 0.2 }}
      >
        {!displaySmallNav && <span>{`Instagram Clone`}</span>}
      </motion.div>
    </Link>
  );
};

export default SideNavLogo;
