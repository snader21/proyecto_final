import { Injectable, Logger } from '@nestjs/common';
import { Storage, Bucket } from '@google-cloud/storage';
import { GCPConfigService } from '../../common/services/gcp-config.service';
import { UploadedFile } from '../interfaces/uploaded-file.interface';
import { Readable } from 'stream';
import { promisify } from 'util';
import { pipeline } from 'stream';

const pipelineAsync = promisify(pipeline);

@Injectable()
export class FileGCP {
  private storage: Storage;
  private bucket: Bucket;
  private readonly logger = new Logger(FileGCP.name);

  constructor(
    private readonly gcpConfigService: GCPConfigService
  ) {
    this.storage = new Storage(this.gcpConfigService.getCredentials());
  }

  private getBucket(): Bucket {
    if (!this.bucket) {
      this.bucket = this.storage.bucket(this.gcpConfigService.getBucketName());
    }
    return this.bucket;
  }

  async save(file: UploadedFile, path: string): Promise<string> {
    const bucket = this.getBucket();
    this.logger.debug(`Guardando archivo en bucket: ${bucket.name}, ruta: ${path}`);
    
    const blob = bucket.file(path);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    try {
      // Crear un stream legible desde el buffer
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      // Usar pipeline para manejar el streaming de forma segura
      await pipelineAsync(
        readableStream,
        blobStream
      );

      // Generar URL pública
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      this.logger.log(`Archivo guardado exitosamente: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      this.logger.error(`Error al guardar archivo en GCS: ${error.message}`);
      throw error;
    }
  }

  private getFileNameFromUrl(url: string): string {
    try {
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        // Obtener todo después del nombre del bucket
        const parts = urlObj.pathname.split('/');
        return parts.slice(2).join('/');
      }
      return url; // Si no es una URL, asumimos que es una ruta relativa
    } catch (error) {
      this.logger.warn(`Error al parsear URL ${url}, usando como ruta relativa`);
      return url;
    }
  }

  async getFile(path: string): Promise<Buffer> {
    try {
      const bucket = this.getBucket();
      const fileName = this.getFileNameFromUrl(path);
      this.logger.debug(`Obteniendo archivo: ${fileName} del bucket: ${bucket.name}`);
      
      const file = bucket.file(fileName);
      const [exists] = await file.exists();
      
      if (!exists) {
        this.logger.error(`Archivo no encontrado: ${fileName}`);
        throw new Error(`File ${fileName} not found`);
      }

      const [fileContent] = await file.download();
      this.logger.debug(`Archivo descargado exitosamente: ${fileName}`);
      return fileContent;
    } catch (error) {
      this.logger.error(`Error al obtener archivo de GCS: ${error.message}`);
      throw error;
    }
  }

  async getUrl(fileName: string): Promise<string> {
    try {
      const bucket = this.getBucket();
      const file = bucket.file(fileName);
      const [exists] = await file.exists();
      
      if (!exists) {
        throw new Error(`File ${fileName} not found`);
      }

      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      });

      return url;
    } catch (error) {
      this.logger.error(`Error al generar URL firmada: ${error.message}`);
      throw error;
    }
  }
}