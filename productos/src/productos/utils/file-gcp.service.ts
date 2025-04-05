import { Injectable, StreamableFile } from '@nestjs/common';
import { Bucket, Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

@Injectable()
export class FileGCP {
  private storage: Storage;
  private bucket: Bucket;
  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get<string>('GCP_PROJECT_ID'),
      ...(process.env.NODE_ENV === 'production'
        ? {}
        : {
            credentials: {
              client_email: this.configService.get<string>('GCP_CLIENT_EMAIL'),
              private_key: this.configService.get<string>('GCP_PRIVATE_KEY'),
            },
          }),
    });
  }

  private getBucket(): Bucket {
    if (!this.bucket) {
      this.bucket = this.storage.bucket(
        this.configService.get<string>('GCP_BUCKET_NAME')!,
      );
    }
    return this.bucket;
  }

  async save(file: UploadedFile, path: string): Promise<string> {
    const bucket = this.getBucket();

    const blob = bucket.file(path);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        console.error('💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥GCS Upload Error:', error);
        reject(error);
      });

      blobStream.on('finish', async () => {
        try {
          const [url] = await blob.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
          });
          resolve(url);
        } catch (error) {
          reject(error);
        }
      });
      blobStream.end(file.buffer);
    });
  }

  async getFile(fileName: string): Promise<StreamableFile> {
    const bucket = this.getBucket();
    const file = bucket.file(fileName);
    const [exists] = await file.exists();

    if (!exists) {
      throw new Error('File not found');
    }

    const [fileContent] = await file.download();
    return new StreamableFile(fileContent);
  }

  async getUrl(fileName: string): Promise<string> {
    const bucket = this.getBucket();
    const file = bucket.file(fileName);
    const [exists] = await file.exists();

    if (!exists) {
      throw new Error('File not found');
    }

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  }
}
