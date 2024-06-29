import { useClickOutside } from "@mantine/hooks";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  onClose?: () => void;
  children: ReactNode;
}

const Modal = ({ onClose, children }: ModalProps) => {
  const modalRef = useClickOutside(onClose ? onClose : () => null);

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

const Header = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative border-b border-ig-elevated-separator px-4 py-2.5">
      {children}
    </div>
  );
};

Header.Title = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-center font-bold">{children}</h2>;
};

Header.ArrowBack = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="absolute top-1/2 -translate-y-1/2"
      type="button"
      onClick={onClick}
    >
      <ArrowLeft size={18} />
    </button>
  );
};

Header.Action = ({ children }: { children: ReactNode }) => {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2">{children}</div>
  );
};

Modal.Header = Header;

export default Modal;
