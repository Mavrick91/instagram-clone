import { useClickOutside } from "@mantine/hooks";
import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  toggle: () => void;
  triggerRef: HTMLElement | null;
};

const SideNavOverlay = ({ children, toggle, triggerRef }: Props) => {
  const [overlayRef, setOverlayRef] = useState<HTMLElement | null>(null);

  useClickOutside(toggle, null, [triggerRef, overlayRef]);

  const variants = {
    open: { left: "71px" },
    closed: { left: "-330px" },
  };

  return (
    <motion.div
      ref={setOverlayRef}
      animate="open"
      className="fixed z-10 flex h-full w-[397px] flex-col overflow-hidden rounded-r-2xl border border-ig-separator bg-ig-primary-background py-2 shadow-custom"
      exit="closed"
      initial="closed"
      transition={{ duration: 0.3 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default SideNavOverlay;
