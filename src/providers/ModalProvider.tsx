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

import CollectionActionDialog, {
  CollectionActionProps,
} from "@/components/CollectionActionDialog";
// Import your modal components here
import CreateConversationDialog from "@/components/CreateConversationDialog";
import {
  EditCollectionName,
  EditCollectionNameProps,
} from "@/components/EditCollectionName";
import EditProfileDialog from "@/components/EditProfileDialog";
import FollowersDialog, {
  FollowersDialogProps,
} from "@/components/FollowersDialog";
import NewCollectionForm, {
  NewCollectionFormProps,
} from "@/components/NewCollectionForm";
import PostActionDialog, {
  PostActionProps,
} from "@/components/PostActionDialog";
import PostDetailsDialog, {
  PostDetailsDialogProps,
} from "@/components/PostDetailsDialog";
import SecondaryDialog, {
  SecondaryDialogProps,
} from "@/components/SecondaryDialog";
import UploadPostDialog, {
  UploadPostDialogProps,
} from "@/components/UploadPostDialog";

import AddPicturesDialog, {
  AddPicturesDialogProps,
} from "../components/AddPicturesDialog";

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
  SecondaryDialog: SecondaryDialogProps;
  NewCollectionForm: NewCollectionFormProps;
  EditCollectionName: EditCollectionNameProps;
  CollectionActionDialog: CollectionActionProps;
  AddPicturesDialog: AddPicturesDialogProps;
};

type ModalKeys = keyof ModalProps;
type ModalPropsType<K extends ModalKeys> = ModalProps[K];

type ModalComponentType = {
  [K in ModalKeys]: (props: ModalPropsType<K>) => ReactElement;
};

const modals: ModalComponentType = {
  PostDetails: (props: PostDetailsDialogProps) => {
    return <PostDetailsDialog {...props} />;
  },
  Followers: (props: FollowersDialogProps) => {
    return <FollowersDialog {...props} />;
  },
  EditProfile: () => {
    return <EditProfileDialog />;
  },
  CreateConversation: () => {
    return <CreateConversationDialog />;
  },
  UploadPostDialog: (props: UploadPostDialogProps) => {
    return <UploadPostDialog {...props} />;
  },
  PostActionDialog: (props: PostActionProps) => {
    return <PostActionDialog {...props} />;
  },
  SecondaryDialog: (props: SecondaryDialogProps) => {
    return <SecondaryDialog {...props} />;
  },
  NewCollectionForm: (props: NewCollectionFormProps) => {
    return <NewCollectionForm {...props} />;
  },
  EditCollectionName: (props: EditCollectionNameProps) => {
    return <EditCollectionName {...props} />;
  },
  CollectionActionDialog: (props: CollectionActionProps) => {
    return <CollectionActionDialog {...props} />;
  },
  AddPicturesDialog: (props: AddPicturesDialogProps) => {
    return <AddPicturesDialog {...props} />;
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
        const content = <ModalComponent {...(props as ModalPropsType<K>)} />;
        if (isPrimaryOpen) {
          setSecondaryContent(content);
          setIsSecondaryOpen(true);
        } else {
          setPrimaryContent(content);
          setIsPrimaryOpen(true);
        }
      }
    },
    [isPrimaryOpen],
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
