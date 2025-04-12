import { IsArray } from 'class-validator';

export class UploadImagesDto {
  @IsArray()
  files: Express.Multer.File[];
}
