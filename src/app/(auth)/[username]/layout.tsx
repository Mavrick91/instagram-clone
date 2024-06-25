import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getDefaultCollectionByUsername } from "@/actions/collection";
import getQueryClient from "@/lib/queryClient";
import { ServerLayoutProps } from "@/types/global";

const ProfileLayout = async ({
  children,
  params,
}: ServerLayoutProps<"username">) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["collection", params.username, "default"],
    queryFn: () => {
      return getDefaultCollectionByUsername(params.username);
    },
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
};

export default ProfileLayout;
