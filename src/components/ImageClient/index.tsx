"use client";

import Image, { ImageProps } from "next/image";

import { cn } from "@/lib/utils";

type CustomImageProps = ImageProps & {
  className?: string;
};

const ImageClient = ({ src, alt, className, ...props }: CustomImageProps) => {
  return (
    <Image
      alt={alt}
      className={cn("object-cover", className)}
      src={src}
      {...props}
    />
  );
};

export default ImageClient;
