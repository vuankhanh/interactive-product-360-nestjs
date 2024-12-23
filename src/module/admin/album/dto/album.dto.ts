import { IsNumberString, IsOptional, IsString } from "class-validator";

export class AlbumDto {
  @IsOptional()
  @IsNumberString({}, { message: 'IsMain must be a number' })
  isMain: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description: string;
}