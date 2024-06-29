import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { getUserByUsername } from "@/actions/user";
import UserListItem from "@/components/UserListItem";

const UsernameSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [debounced] = useDebouncedValue(inputValue, 400);

  const { data, isFetching } = useQuery({
    queryKey: ["usersByUsername", debounced],
    queryFn: async () => getUserByUsername(debounced),
    enabled: !!debounced,
    initialData: [],
  });

  return (
    <>
      <div className="pb-9 pl-6 pt-3 text-2xl font-semibold text-ig-primary-text">
        Search
      </div>
      <div className="relative mb-6 px-4">
        <input
          autoFocus
          className="h-10 w-full rounded-md bg-ig-highlight-background px-4 py-1 text-ig-primary-text focus:outline-none"
          placeholder="Search"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <button
          className="absolute right-8 top-1/2 -translate-y-1/2"
          onClick={() => setInputValue("")}
        >
          <CircleX color="gray" size={20} />
        </button>
      </div>
      {(!data || (data && data.length === 0)) && !isFetching && (
        <div className="border-b border-ig-separator" />
      )}

      <div className="flex grow flex-col gap-1 overflow-y-auto">
        {isFetching ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 10 }).map((_, index) => {
              return (
                <div key={index} className="flex items-center gap-1 px-6 py-1">
                  <div
                    className="size-11 animate-pulse rounded-full bg-ig-highlight-background"
                    style={{ animationDelay: `${index * 0.3}s` }}
                  />
                  <div className="flex grow flex-col gap-2">
                    <div
                      className="h-4 animate-pulse rounded bg-ig-highlight-background"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    />
                    <div
                      className="h-4 animate-pulse rounded bg-ig-highlight-background"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          data &&
          data.map((user) => {
            return (
              <Link key={user.id} href={`/${user.username}`}>
                <div className="w-full overflow-hidden px-6 py-2 hover:bg-ig-hover-overlay">
                  <UserListItem
                    avatar={user.avatar}
                    bottomText={`${user.firstName} ${user.lastName}`}
                    topText={user.username}
                    width={44}
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
