import { RevalidatePath } from "@/types/global";

export const revalidateAuth: RevalidatePath = {
  originalPath: "/(auth)",
};

export const revalidateUserProfilePage: RevalidatePath = {
  originalPath: "/(auth)/[username]/(profile)",
  type: "layout",
};

export const revalidateCollectionPage: RevalidatePath = {
  originalPath: "/(auth)/[username]/collection/[collectionName]",
  type: "page",
};
