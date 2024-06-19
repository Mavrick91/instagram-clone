import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import * as bcrypt from "bcrypt";

import { convertAndUploadImage } from "../src/image-upload.util";

const prisma = new PrismaClient();

async function fetchAndProcessImage(url: string, baseKey: string) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const imageBuffer = Buffer.from(response.data, "binary");

  const urls = await convertAndUploadImage(imageBuffer, baseKey, [
    { name: "original" },
    { name: "thumbnail", width: 300, height: 300 },
    { name: "medium", width: 512 },
    { name: "small", width: 170 },
  ]);

  return urls;
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

  type UserId = { id: number };

  const userIds: UserId[] = await prisma.user.findMany({
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

  type PictureId = { id: number };

  const pictureIds: PictureId[] = await prisma.picture.findMany({
    select: { id: true },
    take: createdPictures.count,
  });

  // Create mock comments
  const mockComments = Array.from({ length: 50 }, () => ({
    content: faker.lorem.paragraph(),
    userId: faker.helpers.arrayElement(userIds).id,
    pictureId: faker.helpers.arrayElement(pictureIds).id,
  }));

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
