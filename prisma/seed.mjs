import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import bcrypt from "bcryptjs";
import sharp from "sharp";

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.REGION_AWS,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
  },
});

const convertAndUploadImage = async (imageBuffer, baseKey, sizes) => {
  const urls = {};

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
      Bucket: process.env.S3_BUCKET_NAME_AWS,
      Key: key,
      Body: webpData,
      ContentType: "image/webp",
    };

    await s3Client.send(new PutObjectCommand(params));

    urls[size.name] = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
  }

  return urls;
};

async function fetchAndProcessImage(url, baseKey) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const imageBuffer = Buffer.from(response.data, "binary");

  return await convertAndUploadImage(imageBuffer, baseKey, [
    { name: "original" },
    { name: "thumbnail", width: 300, height: 300 },
    { name: "medium", width: 512 },
    { name: "small", width: 170 },
  ]);
}

async function main() {
  const password = "test";
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create mock users
  const mockUsers = Array.from({ length: 10 }, () => {
    return {
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatar: faker.image.avatar(),
      username: faker.internet.userName().toLowerCase(),
      isMock: true,
    };
  });

  const createdUsers = await prisma.user.createMany({
    data: mockUsers,
  });

  const userIds = await prisma.user.findMany({
    select: { id: true },
    take: createdUsers.count,
  });

  for (const user of userIds) {
    await prisma.collection.create({
      data: {
        name: "All posts",
        nameId: "all-posts",
        userId: user.id,
        isDefault: true,
      },
    });
  }

  const mockPictures = await Promise.all(
    Array.from({ length: 15 }, async () => {
      const imageUrl = `https://picsum.photos/1400/1400?random=${Math.floor(Math.random() * 1000)}`;
      const baseKey = `posts/post-${faker.string.uuid()}`;
      const sizes = await fetchAndProcessImage(imageUrl, baseKey);

      return {
        fileName: faker.system.commonFileName("webp"),
        description: faker.lorem.sentence(),
        userId: faker.helpers.arrayElement(userIds).id,
        sizes: sizes,
      };
    }),
  );

  const createdPictures = await prisma.picture.createMany({
    data: mockPictures,
  });

  const pictureIds = await prisma.picture.findMany({
    select: { id: true },
    take: createdPictures.count,
  });

  // Create mock comments
  const mockComments = Array.from({ length: 50 }, () => {
    return {
      content: faker.lorem.paragraph(),
      userId: faker.helpers.arrayElement(userIds).id,
      pictureId: faker.helpers.arrayElement(pictureIds).id,
    };
  });

  await prisma.comment.createMany({
    data: mockComments,
  });

  console.log("Mock data seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
