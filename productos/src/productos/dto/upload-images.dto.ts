import { IsArray } from 'class-validator';
import { UploadedFile } from '../interfaces/uploaded-file.interface';

export class UploadImagesDto {
  @IsArray()
  files: UploadedFile[];
}
