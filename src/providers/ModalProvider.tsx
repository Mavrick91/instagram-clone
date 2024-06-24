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

// Import your modal components here
import CreateConversationDialog from "@/components/CreateConversationDialog";
import EditProfileDialog from "@/components/EditProfileDialog";
import ExitDialog, { ExitDialogProps } from "@/components/ExitDialog";
import FollowersDialog, {
  FollowersDialogProps,
} from "@/components/FollowersDialog";
import PostActionDialog, {
  PostActionProps,
} from "@/components/PostActionDialog";
import PostDetailsDialog, {
  PostDetailsDialogProps,
} from "@/components/PostDetailsDialog";
import UploadPostDialog, {
  UploadPostDialogProps,
} from "@/components/UploadPostDialog";

const Modal = dynamic(
  () => {
    return import("@/components/Modal");
  },
  { ssr: false },
);

type ModalProps = {
  PostDetails: PostDetailsDialogProps;
  Followers: FollowersDialogProps;
  EditProfile: undefined;
  CreateConversation: undefined;
  UploadPostDialog: UploadPostDialogProps;
  PostActionDialog: PostActionProps;
  ExitDialog: ExitDialogProps;
};

type ModalKeys = keyof ModalProps;
type ModalPropsType<K extends ModalKeys> = ModalProps[K];

type ModalComponentType = {
  [K in ModalKeys]: (
    props: ModalPropsType<K> & { onClose: () => void },
  ) => ReactElement;
};

const modals: ModalComponentType = {
  PostDetails: (props: PostDetailsDialogProps) => {
    return <PostDetailsDialog {...props} />;
  },
  Followers: (props: FollowersDialogProps) => {
    return <FollowersDialog {...props} />;
  },
  EditProfile: ({ onClose }) => {
    return <EditProfileDialog onClose={onClose} />;
  },
  CreateConversation: () => {
    return <CreateConversationDialog />;
  },
  UploadPostDialog: (
    props: UploadPostDialogProps & { onClose: () => void },
  ) => {
    return <UploadPostDialog {...props} />;
  },
  PostActionDialog: (props: PostActionProps & { onClose: () => void }) => {
    return <PostActionDialog {...props} />;
  },
  ExitDialog: (props: ExitDialogProps) => {
    return <ExitDialog {...props} />;
  },
};

interface ModalFunctionsContextType {
  showModal: <K extends ModalKeys>(key: K, props?: ModalPropsType<K>) => void;
  closeModal: () => void;
  closeAllModal: () => void;
  isModalOpen: boolean;
}

const ModalFunctionsContext = createContext<
  ModalFunctionsContextType | undefined
>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isPrimaryOpen, setIsPrimaryOpen] = useState(false);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const [primaryContent, setPrimaryContent] = useState<ReactElement | null>(
    null,
  );
  const [secondaryContent, setSecondaryContent] = useState<ReactElement | null>(
    null,
  );

  const closePrimaryModal = useCallback(() => {
    setIsPrimaryOpen(false);
    setPrimaryContent(null);
  }, []);

  const closeSecondaryModal = useCallback(() => {
    setIsSecondaryOpen(false);
    setSecondaryContent(null);
  }, []);

  const closeAllModal = useCallback(() => {
    closePrimaryModal();
    closeSecondaryModal();
  }, [closePrimaryModal, closeSecondaryModal]);

  const closeModal = useCallback(() => {
    if (isSecondaryOpen) closeSecondaryModal();
    else closePrimaryModal();
  }, [closePrimaryModal, closeSecondaryModal, isSecondaryOpen]);

  const showModal = useCallback(
    <K extends ModalKeys>(key: K, props?: ModalPropsType<K>) => {
      const ModalComponent = modals[key];
      if (ModalComponent) {
        const content = (
          // @ts-expect-error
          <ModalComponent
            {...(props as ModalPropsType<K>)}
            onClose={isPrimaryOpen ? closeSecondaryModal : closePrimaryModal}
          />
        );
        if (isPrimaryOpen) {
          setSecondaryContent(content);
          setIsSecondaryOpen(true);
        } else {
          setPrimaryContent(content);
          setIsPrimaryOpen(true);
        }
      }
    },
    [isPrimaryOpen, closePrimaryModal, closeSecondaryModal],
  );

  const modalFunctionsValue = useMemo(() => {
    return {
      showModal,
      closeModal,
      closeAllModal,
      isModalOpen: isPrimaryOpen || isSecondaryOpen,
    };
  }, [closeAllModal, closeModal, isPrimaryOpen, isSecondaryOpen, showModal]);

  return (
    <ModalFunctionsContext.Provider value={modalFunctionsValue}>
      {children}
      <Modal
        isOpen={isPrimaryOpen}
        onClose={closeModal}
        hasSecondary={isSecondaryOpen}
      >
        {primaryContent}
      </Modal>
      <Modal isOpen={isSecondaryOpen} onClose={closeModal} isSecondary>
        {secondaryContent}
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
