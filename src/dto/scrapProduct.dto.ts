import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScrapProductDto {
  @ApiProperty({ description: 'The URL of the product to scrape' })
  @IsString()
  url: string;
}
