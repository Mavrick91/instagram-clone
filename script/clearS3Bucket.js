import "dotenv/config";

import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.REGION_AWS,
  systemClockOffset: new Date().getTime() - Date.now(),
});

async function clearS3Bucket() {
  const bucketName = process.env.S3_BUCKET_NAME_AWS;

  // List all objects in the bucket
  const listObjectsResponse = await s3Client.send(
    new ListObjectsV2Command({ Bucket: bucketName }),
  );

  if (listObjectsResponse.Contents) {
    // Prepare objects for deletion
    const objectsToDelete = listObjectsResponse.Contents.map((object) => {
      return {
        Key: object.Key,
      };
    });

    // Delete objects
    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: objectsToDelete },
      }),
    );
  }

  console.log("S3 bucket cleared.");
}

clearS3Bucket().catch(console.error);
