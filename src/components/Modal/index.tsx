"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ReactNode, Suspense, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import useClickOutside from "@/hooks/useOnClickOutside";

import LoadingSpinner from "../ui/LoadingSpinner";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  isSecondary?: boolean;
  hasSecondary?: boolean;
};

const modalVariants = {
  hidden: {
    scale: 0.7,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    scale: 0.7,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const Modal = ({
  isOpen,
  onClose,
  children,
  isSecondary,
  hasSecondary,
}: ModalProps) => {
  const modalRef = useRef(null);
  const canClose = !hasSecondary || isSecondary;

  useClickOutside(
    modalRef,
    canClose
      ? onClose
      : () => {
          return null;
        },
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/50 px-10"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Suspense
            fallback={
              <LoadingSpinner className="size-16 self-center text-white" />
            }
          >
            <motion.div
              ref={modalRef}
              className="fixed z-50 overflow-hidden rounded-lg bg-white shadow-lg"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {children}
            </motion.div>
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot,
  );
};

const Header = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative border-b border-elevated-separator px-4 py-2.5">
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
      onClick={onClick}
      type="button"
      className="absolute top-1/2 -translate-y-1/2"
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
