import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ScrapProductService } from '../service/scrapProduct.service';

@ApiTags('scrap-product')
@Controller()
export class ScrapProductController {
  constructor(private readonly appService: ScrapProductService) {}

  @Get('scrap-product/:url')
  @ApiParam({ name: 'url', required: true })
  scrapProduct(@Param('url') url: string): Promise<ScrapResult> {
    return this.appService.scrapProduct(url);
  }
}
