import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(3000);

  // Gracefully shutdown the server.
  process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing server.');
    app.close();
  });
}
bootstrap();
