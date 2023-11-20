var Minio = require("minio");

export var minioClient = new Minio.Client({
  endPoint: process.env.S3_HOST_URL,
  useSSL: true,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
});
