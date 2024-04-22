
const env = require("dotenv").config();


import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// import dotenv from 'dotenv';
// dotenv.config();


const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;


