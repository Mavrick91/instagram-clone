"use memo";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { createPicture, updatePicture } from "@/actions/picture";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";
import { updateCountForPosts } from "@/utils/user";

import Modal from "../Modal";
import AddCaptionPost from "./AddCaptionPost";
import UploadPostFromComputer from "./UploadPostFromComputer";

const schema = z.object({
  picture: z.union([z.instanceof(File), z.string()]),
  description: z
    .string()
    .max(2200, "Description is too long")
    .transform((v) => {
      return v.trim();
    }),
  altText: z.string(),
  hideLikesAndViewCounts: z.boolean().optional(),
  disableComments: z.boolean().optional(),
});

type RHFFormData = z.infer<typeof schema>;

export type UploadPostDialogProps = {
  picture?: UserPictureDetails;
  title: string;
  buttonSubmitText: string;
};

const UploadPostDialog = ({
  picture,
  title,
  buttonSubmitText,
}: UploadPostDialogProps) => {
  const [currentStep, setCurrentStep] = useState(picture ? 1 : 0);
  const [previewPicture, setPreviewPicture] = useState<string | null>(null);
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const { optimisticUpdate } = useOptimisticActions();
  const currentUser = useUserInfo();

  const { mutate: createPictureMut, isPending: createPending } = useMutation({
    mutationFn: async (data: FormData) => {
      await createPicture(data);
      await queryClient.invalidateQueries({
        queryKey: ["user", currentUser.username, "posts"],
      });
      queryClient.setQueryData(
        ["user", "currentUser"],
        updateCountForPosts.add,
      );
    },
    onSuccess: () => {
      closeModal("uploadPostDialog");
    },
  });

  const defaultValues: RHFFormData = useMemo(() => {
    if (picture) {
      return {
        picture: picture.fileName,
        description: picture.description || "",
        altText: picture.altText || "",
        hideLikesAndViewCounts: picture.hideLikesAndViewCounts,
        disableComments: picture.disableComments,
      };
    }

    return {
      picture: "",
      description: "",
      altText: "",
      hideLikesAndViewCounts: false,
      disableComments: false,
    };
  }, [picture]);

  const methods = useForm<RHFFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const pictureWatch = methods.watch("picture");

  const handleClickArrowLeft = () => {
    setCurrentStep(0);
    setPreviewPicture(null);
    methods.setValue("picture", "");
  };

  useEffect(() => {
    if (pictureWatch) {
      setCurrentStep(1);
      if (picture) setPreviewPicture(picture.sizes.original);
      else if (pictureWatch instanceof File)
        setPreviewPicture(URL.createObjectURL(pictureWatch));
    } else {
      setCurrentStep(0);
    }
  }, [picture, pictureWatch]);

  const onSubmit = async (data: RHFFormData) => {
    const formData = new FormData();
    formData.append("picture", data.picture);
    formData.append("description", data.description);
    formData.append("altText", data.altText);
    formData.append(
      "hideLikesAndViewCounts",
      data.hideLikesAndViewCounts ? "true" : "false",
    );
    formData.append("disableComments", data.disableComments ? "true" : "false");

    try {
      if (picture) {
        optimisticUpdate<UserPictureDetails>({
          queryKey: ["picture", picture.id],
          updateFn: (prev) => {
            return {
              ...prev,
              description: data.description,
              altText: data.altText,
            };
          },
          action: async () => {
            await updatePicture(picture!.id, {
              description: data.description,
              altText: data.altText,
            });
          },
        });
      } else createPictureMut(formData);
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  return (
    <>
      <div className="min-w-[755px] max-w-[1095px]">
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Modal.Header>
              {currentStep === 1 && !picture && (
                <Modal.Header.ArrowBack onClick={handleClickArrowLeft} />
              )}
              <Modal.Header.Title>{title}</Modal.Header.Title>
              {currentStep === 1 && (
                <Modal.Header.Action>
                  <Button
                    className="font-semibold"
                    loading={createPending}
                    type="submit"
                  >
                    {buttonSubmitText}
                  </Button>
                </Modal.Header.Action>
              )}
            </Modal.Header>
            {currentStep === 0 && <UploadPostFromComputer />}
            {currentStep === 1 && previewPicture && (
              <AddCaptionPost
                isEdit={!!picture}
                previewPicture={previewPicture}
              />
            )}
          </form>
        </Form>
      </div>
    </>
  );
};

export default UploadPostDialog;
