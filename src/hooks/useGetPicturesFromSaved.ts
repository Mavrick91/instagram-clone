import { useUserInfo } from "@/providers/UserInfoProvider";

export default function useGetPicturesFromSaved() {
  const user = useUserInfo();

  return [...user.collections].sort((a, b) => a.id - b.id)[0];
}
