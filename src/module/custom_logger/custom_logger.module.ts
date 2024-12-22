import { Module } from '@nestjs/common';
import { CustomLoggerService } from './custom_logger.service';

@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService]
})
export class CustomLoggerModule {}
