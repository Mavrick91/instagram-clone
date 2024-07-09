"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateUserProfile } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/UserAvatar";
import { revalidateUserProfilePage } from "@/constants/revalidate";
import { useOptimisticActions } from "@/hooks/useOptimisticActions";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { CurrentUserType } from "@/types/user";

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
      firstName: user.first_name,
      lastName: user.last_name,
      bio: user.bio ?? "",
      avatar: user.avatar,
    },
  });
  const { optimisticUpdate } = useOptimisticActions();

  const bioWatch = watch("bio");

  const onSubmit = async (data: FormData) => {
    try {
      optimisticUpdate<CurrentUserType>({
        queryKey: ["user", user.username],
        updateFn: (user) => {
          return {
            ...user,
            ...data,
          };
        },
        action: async () => {
          await updateUserProfile(
            user.username,
            {
              first_name: data.firstName,
              last_name: data.lastName,
              bio: data.bio,
            },
            revalidateUserProfilePage,
          );
        },
      });

      closeModal("editProfileDialog");
    } catch (error) {
      console.error("Failed to update user posts:", error);
    }
  };

  return (
    <form
      className="flex w-screen max-w-lg flex-col gap-3 p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center space-x-4">
        <UserAvatar avatar={user.avatar} width={96} />
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
            error={errors.bio?.message}
            id="bio"
            placeholder="Enter your bio"
          />
          <span className="text-sm text-ig-secondary-text">
            {bioWatch?.length} / 150 characters
          </span>
        </div>
      </div>
      <Button className="ml-auto mt-4" type="submit" variant="primary">
        Save
      </Button>
    </form>
  );
};

export default EditProfileDialog;
