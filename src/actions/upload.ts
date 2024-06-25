"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

type ImageUrls = {
  [key: string]: string;
};

export const convertAndUploadImage = async (
  imageBuffer: Buffer,
  baseKey: string,
  sizes: { name: string; width?: number; height?: number }[],
) => {
  const urls: ImageUrls = {};

  for (const size of sizes) {
    let resizeOptions = {};
    if (size.width || size.height) {
      resizeOptions = {
        width: size.width,
        height: size.height,
        fit: "cover",
        withoutEnlargement: true,
      };
    }

    const webpData = await sharp(imageBuffer)
      .resize(resizeOptions)
      .toFormat("webp")
      .toBuffer();

    const key = `${baseKey}-${size.name}.webp`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: webpData,
      ContentType: "image/webp",
    };

    await s3Client.send(new PutObjectCommand(params));

    urls[size.name] = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
  }

  return urls;
};

export const uploadFile = async (formData: FormData) => {
  const file = formData.get("picture") as File;

  if (!file) {
    throw new Error("No file uploaded");
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileKey = `${Date.now()}.${file.name.split(".").pop()}`;
  const baseKey = `posts/post-${fileKey}`;

  try {
    const urls = await convertAndUploadImage(fileBuffer, baseKey, [
      { name: "original" },
      { name: "thumbnail", width: 300, height: 300 },
      { name: "medium", width: 512 },
      { name: "small", width: 170 },
    ]);

    return { sizes: urls, fileName: fileKey };
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw error;
  }
};
