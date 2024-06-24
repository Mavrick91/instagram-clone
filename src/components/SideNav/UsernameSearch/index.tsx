import { useQuery } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { getUserByUsername } from "@/actions/user";
import UserListItem from "@/components/UserListItem";

const UsernameSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["usersByUsername", debouncedInputValue],
    queryFn: async () => {
      return getUserByUsername(debouncedInputValue);
    },
    enabled: !!debouncedInputValue,
    initialData: [],
  });

  useEffect(() => {
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue]);

  return (
    <>
      <div className="pb-9 pl-6 pt-3 text-2xl font-semibold text-primary-text">
        Search
      </div>
      <div className="relative mb-6 px-4">
        <input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="Search"
          autoFocus
          className="h-10 w-full rounded-md bg-highlight-background px-4 py-1 text-primary-text focus:outline-none"
        />
        <button
          className="absolute right-8 top-1/2 -translate-y-1/2"
          onClick={() => {
            return setInputValue("");
          }}
        >
          <CircleX size={20} color="gray" />
        </button>
      </div>
      {(!data || (data && data.length === 0)) && !isFetching && (
        <div className="border-b border-separator" />
      )}

      <div className="flex grow flex-col gap-1 overflow-y-auto">
        {isFetching ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 10 }).map((_, index) => {
              return (
                <div key={index} className="flex items-center gap-1 px-6 py-1">
                  <div
                    className="size-11 animate-pulse rounded-full bg-highlight-background"
                    style={{ animationDelay: `${index * 0.3}s` }}
                  />
                  <div className="flex grow flex-col gap-2">
                    <div
                      className="h-4 animate-pulse rounded bg-highlight-background"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    />
                    <div
                      className="h-4 animate-pulse rounded bg-highlight-background"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          data.map((user) => {
            return (
              <Link key={user.id} href={`/${user.username}`}>
                <div className="w-full overflow-hidden px-6 py-2 hover:!bg-hover-overlay">
                  <UserListItem
                    avatar={user.avatar}
                    firstName={user.username}
                    subText={
                      <div>
                        {user.firstName} {user.lastName}
                      </div>
                    }
                    subTextSize="sm"
                    username={user.username}
                  />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
};

export default UsernameSearch;
