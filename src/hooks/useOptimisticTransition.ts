"use client";

import { useCallback, useOptimistic, useTransition } from "react";

function useOptimisticTransition<T>(
  initialState: T,
  optimisticUpdate: (state: T, action: T) => T,
) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(
    initialState,
    optimisticUpdate,
  );
  const [isPending, startTransition] = useTransition();

  const updateState = useCallback(
    (newValue: T) => {
      startTransition(() => {
        setOptimisticValue(newValue);
      });
    },
    [setOptimisticValue],
  );

  return [optimisticValue, updateState, isPending] as const;
}

export default useOptimisticTransition;
