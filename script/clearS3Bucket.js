require("dotenv/config");
const {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: process.env.AWS_REGION });

async function clearS3Bucket() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

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
