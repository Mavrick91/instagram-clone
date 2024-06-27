import { motion } from "framer-motion";
import React, { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  onClose?: () => void;
  children: ReactNode;
}

const NewModal: React.FC<ModalProps> = ({ onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        onClose &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        ref={modalRef}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-lg bg-ig-elevated-background"
        exit={{ scale: 0.9, opacity: 0 }}
        initial={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default NewModal;
