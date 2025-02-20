import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { ScrapProductController } from './controller/scrapProduct.controller';
import { ScrapProductService } from './service/scrapProduct.service';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [ScrapProductController],
  providers: [ScrapProductService],
})
export class ScrapProductModule {}
