import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import {
  deleteCollection,
  getUserCollectionDetails,
} from "@/actions/collection";
import { useModal } from "@/providers/ModalProvider";
import { UserCollectionDetails } from "@/types/collection";

const useCollectionDetails = (
  username: string,
  serverUserCollectionDetails: UserCollectionDetails,
) => {
  const { closeModal } = useModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => {
    return ["collection", username, serverUserCollectionDetails.nameId];
  }, [serverUserCollectionDetails.nameId, username]);

  const { data: userCollectionDetails } = useQuery<UserCollectionDetails>({
    queryKey,
    queryFn: () => {
      return getUserCollectionDetails(
        username,
        serverUserCollectionDetails.nameId,
      );
    },
    initialData: serverUserCollectionDetails,
  });

  const { mutate: deleteCollectionMut, isPending } = useMutation({
    mutationFn: () => {
      return deleteCollection(userCollectionDetails.id);
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey });
      await queryClient.invalidateQueries({
        queryKey: ["collections", username],
      });
      closeModal();
      router.back();
    },
  });

  return { userCollectionDetails, deleteCollectionMut, isPending };
};

export default useCollectionDetails;
