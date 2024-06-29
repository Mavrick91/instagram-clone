import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "react-toastify";

import { getErrorMessage } from "@/utils";

type UpdateFunction<T> = (oldData: T) => T;
type ActionFunction<T> = (oldData: T) => Promise<void>;

type OptimisticUpdateOptions<T> = {
  queryKey: ReadonlyArray<unknown>;
  updateFn: UpdateFunction<T>;
  action?: ActionFunction<T>;
  options?: {
    refetch?: boolean;
  };
};

export const useOptimisticActions = () => {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback(
    async <T>({
      queryKey,
      updateFn,
      action,
      options = {},
    }: OptimisticUpdateOptions<T>) => {
      const previousData = queryClient.getQueryData<T>(queryKey);

      if (!previousData) {
        console.error("No data found for query key:", queryKey);
        return;
      }

      const newData = updateFn(previousData);
      queryClient.setQueryData<T>(queryKey, newData);

      try {
        if (action) await action(previousData);
        if (options.refetch) {
          await queryClient.refetchQueries({
            queryKey,
            exact: true,
          });
        }
      } catch (error) {
        queryClient.setQueryData(queryKey, previousData);
        toast(getErrorMessage(error), { type: "error" });
      }
    },
    [queryClient],
  );

  return { optimisticUpdate };
};
