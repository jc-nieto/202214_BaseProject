import { IsDateString, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ClubDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsDateString()
  @IsNotEmpty()
  readonly fundationDate: string;

  @IsUrl()
  @IsNotEmpty()
  readonly url_image: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
