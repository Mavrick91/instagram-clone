"use client";

import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { z } from "zod";

import { deleteCollection } from "@/actions/collection";
import Separator from "@/components/ui/separator";
import { useModal } from "@/providers/ModalProvider";
import { LightCollectionByUserId } from "@/types/collection";

import AddPicturesDialog from "../AddPicturesDialog";

const formSchema = z.object({
  collectionName: z.string().min(1, { message: "Collection name is required" }),
});

export type FormData = z.infer<typeof formSchema>;

export type CollectionActionProps = {
  collectionId: number;
  collectionName: string;
  defaultCollection: LightCollectionByUserId;
};

const CollectionActionDialog = ({
  collectionId,
  collectionName,
  defaultCollection,
}: CollectionActionProps) => {
  const [addPictureDialogOpen, setAddPictureDialogOpen] = useState(false);
  const router = useRouter();
  const { showModal, closeModal } = useModal();

  const handleAction = async (actionType: string) => {
    try {
      if (actionType === "delete-collection") {
        await deleteCollection(collectionId);
        router.back();
      } else if (actionType === "edit") {
        showModal("EditCollectionName", {
          collectionId,
          collectionName,
        });
      } else if (actionType === "add") {
        setAddPictureDialogOpen(true);
      }
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const actions = useMemo(() => {
    return [
      {
        type: "delete-collection",
        label: "Delete collection",
        className: "text-red-500 font-bold",
      },
      { type: "add", label: "Add from saved" },
      { type: "edit", label: "Edit collection" },
      { type: "cancel", label: "Cancel" },
    ];
  }, []);

  return (
    <>
      <div className="w-screen max-w-sm gap-0 rounded-lg p-0 text-center">
        {actions.map((action, index) => {
          return (
            <Fragment key={index}>
              <button
                type="button"
                className={`py-3.5 text-center text-sm ${action.className || ""}`}
                onClick={() => {
                  return handleAction(action.type);
                }}
              >
                <div className="flex items-center justify-center">
                  {action.label}
                </div>
              </button>
              <Separator className="last:hidden" />
            </Fragment>
          );
        })}
      </div>
      {addPictureDialogOpen && (
        <AddPicturesDialog
          isOpen={addPictureDialogOpen}
          setIsOpen={setAddPictureDialogOpen}
          collectionId={collectionId}
          defaultCollection={defaultCollection}
        />
      )}
    </>
  );
};

export default CollectionActionDialog;
