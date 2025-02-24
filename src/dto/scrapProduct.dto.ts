import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScrapProductDto {
  @ApiProperty({ description: 'The URL of the scraped product' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'The title of the product' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The image URL of the product' })
  @IsString()
  image: string;

  @ApiProperty({ description: 'The price of the product' })
  @IsString()
  price: string;

  @ApiProperty({ description: 'The description of the product' })
  @IsString()
  description: string;

  constructor(
    url: string,
    title: string,
    image: string,
    price: string,
    description: string,
  ) {
    this.url = url;
    this.title = title;
    this.image = image;
    this.price = price;
    this.description = description;
  }
}
