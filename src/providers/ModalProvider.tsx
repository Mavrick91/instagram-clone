"use client";

import { AnimatePresence } from "framer-motion";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import CreateConversationDialog from "@/components/CreateConversationDialog";
import NewModal from "@/components/NewModal";
import PostActionDialog from "@/components/PostActionDialog";
import PostDetailsDialog from "@/components/PostDetailsDialog";
import RemoveFromCollectionDialog from "@/components/RemoveFromCollectionDialog";
import UploadPostDialog from "@/components/UploadPostDialog";

import CollectionNameActonDialog from "../components/CollectionDetailsActionDialog";
import NewCollectionForm from "../components/CollectionFormManager";
import CollectionFormManager from "../components/CollectionFormManager";

interface ModalProviderProps {
  children: ReactNode;
}

const modalConfigs = {
  postActionDialog: {
    component: PostActionDialog,
    defaultProps: { onOutsideClick: false },
  },
  uploadPostDialog: {
    component: UploadPostDialog,
    defaultProps: { onOutsideClick: false },
  },
  postDetailsDialog: {
    component: PostDetailsDialog,
    defaultProps: { onOutsideClick: true },
  },
  newCollectionForm: {
    component: NewCollectionForm,
    defaultProps: { onOutsideClick: false },
  },
  collectionNameActonDialog: {
    component: CollectionNameActonDialog,
    defaultProps: { onOutsideClick: false },
  },
  removeFromCollectionDialog: {
    component: RemoveFromCollectionDialog,
    defaultProps: { onOutsideClick: true },
  },
  collectionFormManager: {
    component: CollectionFormManager,
    defaultProps: { onOutsideClick: false },
  },
  createConversationDialog: {
    component: CreateConversationDialog,
    defaultProps: { onOutsideClick: false },
  },
} as const;

type ModalId = keyof typeof modalConfigs;

interface ModalStackItem {
  id: ModalId;
  props: Record<string, any>;
}

interface ModalContextType {
  openModal: (modalId: ModalId, props?: Record<string, any>) => void;
  closeModal: (modalId: ModalId) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStack, setModalStack] = useState<ModalStackItem[]>([]);

  const openModal = useCallback(
    (modalId: ModalId, props: Record<string, any> = {}) => {
      setModalStack((prevStack) => [
        ...prevStack,
        {
          id: modalId,
          props: { ...modalConfigs[modalId]?.defaultProps, ...props },
        },
      ]);
    },
    [],
  );

  const closeModal = useCallback((modalId: ModalId) => {
    setModalStack((prevStack) =>
      prevStack.filter((modal) => modal.id !== modalId),
    );
  }, []);

  const closeAllModals = useCallback(() => {
    setModalStack([]);
  }, []);

  const closeTopModal = useCallback(() => {
    setModalStack((prevStack) => prevStack.slice(0, -1));
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      <AnimatePresence>
        {modalStack.map((modal, index) => {
          const ModalComponent = modalConfigs[modal.id]?.component;
          if (!ModalComponent) return null;

          const isTopModal = index === modalStack.length - 1;

          return (
            <NewModal
              key={`${modal.id}-${index}`}
              onClose={isTopModal ? closeTopModal : undefined}
            >
              <ModalComponent
                {...modal.props}
                onClose={() => closeModal(modal.id)}
              />
            </NewModal>
          );
        })}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export default ModalProvider;
