"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  username: string;
  description?: string | null;
};

const PostCaption = ({ username, description }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(descriptionRef.current).lineHeight,
      );

      if (descriptionRef.current) {
        const lines = descriptionRef.current.scrollHeight / lineHeight;

        setCanExpand(lines >= 2);
      }
    }
  }, [description]);

  if (!description) {
    return null;
  }

  return (
    <div className="mt-2 text-sm text-primary-text">
      <div className="float-left mr-1 whitespace-nowrap font-semibold">
        <Link href={`/${username}`}>{username}</Link>
      </div>
      <p
        ref={descriptionRef}
        className={cn({
          "line-clamp-1 w-3/5": !isExpanded,
        })}
      >
        {description}
      </p>
      {canExpand && (
        <button
          className="text-sm text-secondary"
          onClick={() => {
            setIsExpanded(!isExpanded);
            setCanExpand(false);
          }}
        >
          More
        </button>
      )}
    </div>
  );
};

export default PostCaption;
