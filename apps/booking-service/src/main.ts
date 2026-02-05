import { NestFactory } from '@nestjs/core';
import { BookingServiceModule } from './booking-service.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BookingServiceModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  const port = configService.get('PORT') || 3003;
  await app.listen(port);
  console.log(`🎫 Booking Service is running on: http://localhost:${port}`);
}
bootstrap();
