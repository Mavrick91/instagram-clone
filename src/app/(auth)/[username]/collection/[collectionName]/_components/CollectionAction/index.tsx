"use client";

import { useRouter } from "next/navigation";
import { Fragment, ReactNode, useMemo, useState } from "react";
import { z } from "zod";

import { deleteCollection } from "@/actions/collection";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Separator from "@/components/ui/separator";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserDefaultCollectionPictures } from "@/types/collection";
import { RevalidatePath } from "@/types/global";

import { AddPictures } from "./AddPictures";
import { EditCollectionName } from "./EditCollectionName";

const formSchema = z.object({
  collectionName: z.string().min(1, { message: "Collection name is required" }),
});

export type FormData = z.infer<typeof formSchema>;

type CollectionActionProps = {
  children: ReactNode;
  collectionId: number;
  collectionName: string;
  defaultCollection: UserDefaultCollectionPictures;
};

const revalidatePath: RevalidatePath = {
  originalPath: "/(auth)/[username]/(profile)/saved",
  type: "page",
};

const CollectionAction = ({
  children,
  collectionId,
  collectionName,
  defaultCollection,
}: CollectionActionProps) => {
  const [collectionNameDialogOpen, setCollectionNameDialogOpen] =
    useState(false);
  const [addPictureDialogOpen, setAddPictureDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const user = useUserInfo();
  const router = useRouter();

  const handleAction = async (actionType: string) => {
    try {
      if (actionType === "delete-collection") {
        await deleteCollection(collectionId, revalidatePath);
        router.replace(`/${user.username}/saved`);
      } else if (actionType === "edit") {
        setCollectionNameDialogOpen(true);
      } else if (actionType === "add") {
        setAddPictureDialogOpen(true);
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const actions = useMemo(
    () => [
      {
        type: "delete-collection",
        label: "Delete collection",
        className: "text-red-500 font-bold",
      },
      { type: "add", label: "Add from saved" },
      { type: "edit", label: "Edit collection" },
      { type: "cancel", label: "Cancel" },
    ],
    [],
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button>{children}</button>
        </DialogTrigger>
        <DialogContent className="max-w-sm gap-0 rounded-lg p-0">
          {actions.map((action, index) => (
            <Fragment key={index}>
              <button
                type="button"
                className={`py-3.5 text-center text-sm ${action.className || ""}`}
                onClick={() => handleAction(action.type)}
              >
                <div className="flex items-center justify-center">
                  {action.label}
                </div>
              </button>
              <Separator className="last:hidden" />
            </Fragment>
          ))}
        </DialogContent>
      </Dialog>

      {collectionNameDialogOpen && (
        <EditCollectionName
          collectionName={collectionName}
          collectionId={collectionId}
          isOpen={collectionNameDialogOpen}
          setIsOpen={setCollectionNameDialogOpen}
        />
      )}
      {addPictureDialogOpen && (
        <AddPictures
          isOpen={addPictureDialogOpen}
          setIsOpen={setAddPictureDialogOpen}
          collectionId={collectionId}
          defaultCollection={defaultCollection}
        />
      )}
    </>
  );
};

export default CollectionAction;
