"use client";

import Image, { ImageProps } from "next/image";

import { cn } from "@/lib/utils";

type CustomImageProps = ImageProps & {
  className?: string;
};

const ImageClient = ({ src, alt, className, ...props }: CustomImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      {...props}
    />
  );
};

export default ImageClient;
