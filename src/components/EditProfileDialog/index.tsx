"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateUserProfile } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { revalidateUserProfilePage } from "@/constants/revalidate";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";

const ProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .transform((val) => {
      return val.trim();
    }),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .transform((val) => {
      return val.trim();
    }),
  bio: z
    .string()
    .max(150, "Bio must be 150 characters or less")
    .transform((val) => {
      return val.trim();
    })
    .optional(),
  avatar: z.any().optional(),
});

type FormData = z.infer<typeof ProfileSchema>;

const EditProfileDialog = () => {
  const { closeModal } = useModal();
  const user = useUserInfo();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio ?? "",
      avatar: user.avatar,
    },
  });

  const bioWatch = watch("bio");

  const onSubmit = async (data: FormData) => {
    try {
      await updateUserProfile(
        user.username,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          bio: data.bio,
        },
        revalidateUserProfilePage,
      );

      closeModal();
    } catch (error) {
      console.error("Failed to update user posts:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-screen max-w-lg flex-col gap-3 bg-white p-5"
    >
      <div className="flex items-center space-x-4">
        <Label className="m-0 size-24 cursor-pointer" htmlFor="avatar">
          <span
            className={cn(
              "flex w-full h-full relative items-center group justify-center border-2 rounded-full text-secondary",
              {
                "border-dashed border-gray-300": !user.avatar,
              },
            )}
          ></span>
        </Label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input
            {...register("firstName")}
            error={errors.firstName?.message}
            id="first-name"
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            {...register("lastName")}
            error={errors.lastName?.message}
            id="last-name"
            placeholder="Enter your last name"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>

        <div>
          <Textarea
            {...register("bio")}
            id="bio"
            placeholder="Enter your bio"
            error={errors.bio?.message}
          />
          <span className="text-sm text-secondary">
            {bioWatch?.length} / 150 characters
          </span>
        </div>
      </div>
      <Button className="ml-auto mt-4" type="submit">
        Save
      </Button>
    </form>
  );
};

export default EditProfileDialog;
