import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  releaseYear: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  synopsis: string;
}
