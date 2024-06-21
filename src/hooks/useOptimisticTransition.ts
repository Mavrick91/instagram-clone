"use client";

import { useCallback, useOptimistic, useState, useTransition } from "react";

function useOptimisticTransition<S, A>(
  initialState: S,
  optimisticUpdate: (state: S, action: A) => S,
) {
  const [realValue, setRealValue] = useState<S>(initialState);
  const [optimisticValue, setOptimisticValue] = useOptimistic<S, A>(
    realValue,
    optimisticUpdate,
  );
  const [isPending, startTransition] = useTransition();

  const updateState = useCallback(
    (action: A) => {
      startTransition(() => {
        setOptimisticValue(action);
      });
    },
    [setOptimisticValue],
  );

  return [
    optimisticValue,
    updateState,
    setRealValue,
    realValue,
    isPending,
  ] as const;
}

export default useOptimisticTransition;
