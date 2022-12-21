import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'script-src': ["'self'", "'unsafe-eval'"],
        'style-src': ["'unsafe-inline'"],
      },
    }),
  );
  await app.listen(3000);

  // Gracefully shutdown the server.
  app.enableShutdownHooks();
}
bootstrap();
