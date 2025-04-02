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
      projectId: 'intense-guru-453022-j0',
      credentials: {
        client_email: '1083277898027-compute@developer.gserviceaccount.com',
        private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCvR8bwNXeIdK20\nkSnuX8LeAtD2+HGSZs040u3dwdrQTjpyQrUTfIZ8FgdLqbtVLcsAfD35iqicn9HK\n0HU2Aj+Ireeaxo4Kv7FkiN1i01NH6aEnPxejeK8bWfix/TNSIhB8DqQ1MeXzaUU3\nFsEWbE7BQJV8wJxQXYh8DSte7gkrcitcw/4yAzJdyGTIk7Eg2KBrnO2YYNuFWmm4\nqtyzH8/WxXe+42Y3GC+vnS7FnZfBAZb+IK9YkPqBd3frO4GIxTcAGNWNpVHmAH6g\nLoNxkiTrVKUJBeBw30opqkFKF1It15RVYzvNhVON5lsMRDj/OzumLyBWXMQ2ZvfE\nt8p46lElAgMBAAECggEAHc/wwXrqk4o64D8feWSOvZmPhq4PjRXQmnVf0UuvRqZD\nkRsQ9tlDe3f4sjEShISXJkQ7e0XO82LIeT027mJ4AWyIu73BO4lKp/2SYARvAgh1\n6Tm1MM/uQpHtN4LIF5RlJuCLo+OSh7HUPLAxU7nEtGBifJc7Dv01oVnREmKcqyeG\nMA2s1ffQDhyljuJS+gJlSdVn4xc+wQ+T3yR62ZHf8DoUBJD8geWuoetzrPjCOBk6\nOSamcYBrqdyQ5E8ZjJ79/piBxlMk7W8Qu9v+8eflkZuavzmVVbOoO6NSqQK5GQuy\nhdwMlAH/qUA8N0w25S/ejU8zhN4wt2bL6vg9ITNcMQKBgQDXtgj2mw/jeFlm5w2x\nkfktCv44YcGvsv4cJAZ7mG++as15g+jRLG6JKpr1eE3/Pxf4x9ES0hvHEWxJ1MBk\nnvZEsR+gRzTAfBPmKYMhrIPcE3SGoLJfvwglieVp7HAfukhiBptkQ4nYyXMjfHnH\nc6KjwyMHHhKbOgsGSovg8Yn5UQKBgQDQBJjeqQzbko+Gfth00/nKv2FdjoLJ0T0z\n0xdKouPkMt5ISyKz41txlG8z4MGdC+4T3CjXku0JFM38dGbk82VYOydLBEObCmVZ\nRIXe8zRdAfIgslPeaevn+A5Ton9UrTK1ojiuxzbuBiFjhLvuHHkeQkKG5N8DtBzN\nLbaHbHullQKBgHmClDf+DwwuvgWmP+N3++nwmFXAU2+an2PQs0oqC0AzP32k3Z/+\nrGFd+54s35rZurIsNMyqSHVxjhNk4d+MX+M/9zW9Bq0q97aeSbzNRhXRa8FugixH\nGtqye+WYB20H7UAywpPPK7ZPfClQM/UzYTlocbHPseF4577qfTMAPJ2RAoGAQkSU\npqpYLEL+cixKrL0y4IIjdHiH9d8wjif7TY2i5/nEkmdNQN13LjHJU0+QnoVEbRM/\n950Y4kG8dWZnuRxI9tixZdaP6v5e1xdbRnFYByEtj3j/+uTngFinx8EGq2UZuH9b\na2KPfzh4vol0jSCI/TjClNKosTdZzYt4kJ/grBkCgYAw7zstIkmehIrufL92EXOq\nJfJA7NbXAI+lTWzbS5AmLlm3ypmyGUInkCERJrtc6B4PTClzG6wtsrocYJPrt1J7\neTEuyioOrUufKV8IxlLTE4oVIz2nX2ygaJvlw7+nB4Jpah9ggjMAeXY0DrRwZ9Me\nZYHAfnK8QXkhnQDnJGkpzA==\n-----END PRIVATE KEY-----\n'
      }
    });
  }

  private getBucket(): Bucket {
    if (!this.bucket) {
      this.bucket = this.storage.bucket('proyecto-final-ccp-bucket');
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
      blobStream.on('error', (error) => reject(error));
      blobStream.on('finish', async () => {
        try {
          const [url] = await blob.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
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