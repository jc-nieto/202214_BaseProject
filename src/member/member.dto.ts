import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MemberDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsDateString()
  @IsNotEmpty()
  readonly birthDate: string;
}