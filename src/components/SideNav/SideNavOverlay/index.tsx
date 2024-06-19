import { motion } from "framer-motion";
import { useRef } from "react";

import useClickOutside from "@/hooks/useOnClickOutside";

type Props = {
  children: React.ReactNode;
  toggle: () => void;
};

export default function SideNavOverlay({ children, toggle }: Props) {
  const ref = useRef(null);

  useClickOutside(ref, () => {
    toggle();
  });

  const variants = {
    open: { left: "71px" },
    closed: { left: "-330px" },
  };

  return (
    <motion.div
      ref={ref}
      initial="closed"
      animate="open"
      exit="closed"
      variants={variants}
      transition={{ duration: 0.3 }}
      className="fixed z-10 flex h-full w-[397px] flex-col overflow-hidden rounded-r-2xl border border-separator bg-primary-background py-2 shadow-ig"
    >
      {children}
    </motion.div>
  );
}
