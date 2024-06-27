import { RevalidatePath } from "@/types/global";

export const revalidateAuth: RevalidatePath = {
  originalPath: "/(auth)",
};

export const revalidateDirect: RevalidatePath = {
  originalPath: "/direct",
};

export const revalidateUserProfilePage: RevalidatePath = {
  originalPath: "/(auth)/[username]/(profile)",
  type: "layout",
};

export const revalidateCollectionPage: RevalidatePath = {
  originalPath: "/(auth)/[username]/collection/[collectionId]",
  type: "page",
};
