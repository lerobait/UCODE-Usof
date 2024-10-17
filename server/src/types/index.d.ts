import { Request } from 'express';
import { S3File } from 'multer-s3';

declare module 'express-serve-static-core' {
  interface Request {
    file?: S3File;
  }
}
