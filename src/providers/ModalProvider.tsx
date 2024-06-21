"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import CreateConversationDialog from "@/components/CreateConversationDialog";
import EditProfileDialog from "@/components/EditProfileDialog";
import FollowersDialog, {
  FollowersDialogProps,
} from "@/components/FollowersDialog";
import PostDetailsDialog, {
  PostDetailsDialogProps,
} from "@/components/PostDetailsDialog";

const Modal = dynamic(() => import("@/components/Modal"), {
  ssr: false,
});

const modals = {
  PostDetails: (props: PostDetailsDialogProps) => (
    <PostDetailsDialog {...props} />
  ),
  Followers: (props: FollowersDialogProps) => <FollowersDialog {...props} />,
  EditProfile: () => <EditProfileDialog />,
  CreateConversation: () => <CreateConversationDialog />,
};

type ModalProps = {
  PostDetails: PostDetailsDialogProps;
  Followers: FollowersDialogProps;
  EditProfile: undefined;
  CreateConversation: undefined;
};

type ModalKeys = keyof typeof modals;
type ModalPropsType<K extends ModalKeys> = K extends keyof ModalProps
  ? ModalProps[K]
  : never;

interface ModalFunctionsContextType {
  showModal: <K extends ModalKeys>(key: K, props?: ModalPropsType<K>) => void;
  closeModal: () => void;
}

const ModalFunctionsContext = createContext<
  ModalFunctionsContextType | undefined
>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactElement | null>(null);

  const showModal = <K extends ModalKeys>(
    key: K,
    props?: ModalPropsType<K>,
  ) => {
    const ModalComponent = modals[key];
    if (ModalComponent) {
      // @ts-expect-error - props are optional
      setContent(<ModalComponent {...props} />);
      setIsOpen(true);
    }
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
  }, []);

  const modalFunctionsValue = useMemo(
    () => ({ showModal, closeModal, isOpen, content }),
    [closeModal, isOpen, content],
  );

  return (
    <ModalFunctionsContext.Provider value={modalFunctionsValue}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {content}
      </Modal>
    </ModalFunctionsContext.Provider>
  );
};

export const useModal = (): ModalFunctionsContextType => {
  const context = useContext(ModalFunctionsContext);
  if (!context) {
    throw new Error("useModalFunctions must be used within a ModalProvider");
  }
  return context;
};
