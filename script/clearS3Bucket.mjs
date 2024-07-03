import "dotenv/config";
import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.REGION_AWS,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
  },
});

async function clearS3Bucket() {
  const bucketName = process.env.S3_BUCKET_NAME_AWS;

  if (!bucketName) {
    console.error("S3_BUCKET_NAME_AWS is not set");
    process.exit(1);
  }

  try {
    // List all objects in the bucket
    const listObjectsResponse = await s3Client.send(
      new ListObjectsV2Command({ Bucket: bucketName })
    );

    if (listObjectsResponse.Contents && listObjectsResponse.Contents.length > 0) {
      // Prepare objects for deletion
      const objectsToDelete = listObjectsResponse.Contents.map((object) => ({
        Key: object.Key,
      }));

      // Delete objects
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: { Objects: objectsToDelete },
        })
      );
      console.log("S3 bucket cleared.");
    } else {
      console.log("S3 bucket is already empty.");
    }
  } catch (error) {
    console.error("Error clearing S3 bucket:", error);
    process.exit(1);
  }
}

clearS3Bucket();