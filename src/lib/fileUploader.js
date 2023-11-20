import { minioClient } from "./s3Connector";

var file = "dbConnector.js";

await minioClient.fPutObject("jody-bucket", "test file", file);
console.log("File uploaded successfully.");
