import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const s3Config = {
    region: process.env.AWS_REGION || "ap-south-1",
};

// Use static credentials only when they are explicitly configured.
// Otherwise, AWS SDK automatically uses the EC2 IAM role.
if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
) {
    s3Config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
}

const s3 = new S3Client(s3Config);

export default s3;
