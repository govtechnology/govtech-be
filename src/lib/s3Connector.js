var Minio = require("minio");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

export var minioClient = new Minio.Client({
  endPoint: process.env.S3_HOST_URL,
  useSSL: true,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
});

export const uploadMinioStorage = async (bucketName, remotePath, tempPath) => {
  try {
    const metaData = {
      "Content-Type": "application/octet-stream",
    };

    const upload = await minioClient.fPutObject(
      bucketName,
      remotePath,
      tempPath
    );

    await unlinkAsync(tempPath);
    return upload;
  } catch (error) {
    throw new Error(error);
  }
};
