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
import EditProfileDialog from "@/components/EditProfileDialog";
import FollowersDialog, {
  FollowersDialogProps,
} from "@/components/FollowersDialog";
import PostActionDialog, {
  PostActionProps,
} from "@/components/PostActionDialog";
import PostDetailsDialog, {
  PostDetailsDialogProps,
} from "@/components/PostDetailsDialog";
import RemoveFromCollectionDialog, {
  RemoveFromCollectionDialogProps,
} from "@/components/RemoveFromCollectionDialog";
import UploadPostDialog, {
  UploadPostDialogProps,
} from "@/components/UploadPostDialog";

import CollectionNameActonDialog, {
  CollectionNameActionDialogProps,
} from "../components/CollectionDetailsActionDialog";
import NewCollectionForm from "../components/CollectionFormManager";
import CollectionFormManager, {
  CollectionFormManagerProps,
} from "../components/CollectionFormManager";
import Modal from "../components/Modal";

interface ModalProviderProps {
  children: ReactNode;
}

type ModalConfig = {
  postActionDialog: { props?: PostActionProps };
  uploadPostDialog: { props?: UploadPostDialogProps };
  postDetailsDialog: { props?: PostDetailsDialogProps };
  newCollectionForm: { props?: CollectionFormManagerProps };
  collectionNameActonDialog: { props?: CollectionNameActionDialogProps };
  removeFromCollectionDialog: { props?: RemoveFromCollectionDialogProps };
  collectionFormManager: { props?: CollectionFormManagerProps };
  createConversationDialog: { props?: undefined };
  followersDialog: { props?: FollowersDialogProps };
  editProfileDialog: { props?: undefined };
};

type ModalId = keyof ModalConfig;

type ModalStackItem = {
  [K in ModalId]: { id: K; props?: ModalConfig[K]["props"] };
}[ModalId];

interface ModalContextType {
  openModal: <T extends ModalId>(
    modalId: T,
    props?: ModalConfig[T]["props"],
  ) => void;
  closeModal: (modalId: ModalId) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStack, setModalStack] = useState<ModalStackItem[]>([]);

  const openModal = useCallback(
    <T extends ModalId>(modalId: T, props?: ModalConfig[T]["props"]) => {
      setModalStack((prevStack) => [
        ...prevStack,
        { id: modalId, props } as ModalStackItem,
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

  const renderModal = (modal: ModalStackItem) => {
    switch (modal.id) {
      case "postActionDialog":
        return modal.props ? <PostActionDialog {...modal.props} /> : null;
      case "uploadPostDialog":
        return modal.props ? <UploadPostDialog {...modal.props} /> : null;
      case "postDetailsDialog":
        return modal.props ? <PostDetailsDialog {...modal.props} /> : null;
      case "newCollectionForm":
        return modal.props ? <NewCollectionForm {...modal.props} /> : null;
      case "collectionNameActonDialog":
        return modal.props ? (
          <CollectionNameActonDialog {...modal.props} />
        ) : null;
      case "removeFromCollectionDialog":
        return modal.props ? (
          <RemoveFromCollectionDialog {...modal.props} />
        ) : null;
      case "collectionFormManager":
        return modal.props ? <CollectionFormManager {...modal.props} /> : null;
      case "createConversationDialog":
        return <CreateConversationDialog />;
      case "followersDialog":
        return modal.props ? <FollowersDialog {...modal.props} /> : null;
      case "editProfileDialog":
        return <EditProfileDialog />;
      default:
        return null;
    }
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      <AnimatePresence>
        {modalStack.map((modal, index) => {
          const isTopModal = index === modalStack.length - 1;

          return (
            <Modal
              key={`${modal.id}-${index}`}
              onClose={isTopModal ? closeTopModal : undefined}
            >
              {renderModal(modal)}
            </Modal>
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
