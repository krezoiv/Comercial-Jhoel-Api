import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

/**
 * Application entry point — creates the Nest application context from
 * `AppModule` and wires the process-wide (not per-module) HTTP concerns
 * that only make sense configured once, in one place, before the server
 * starts accepting connections.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Standard security headers (X-Frame-Options, X-Content-Type-Options, HSTS,
  // etc.) on every response — applied before any route handling, as Express
  // middleware, not a Nest guard/interceptor.
  app.use(helmet());

  // Every route lives under /api/* (e.g. /api/auth/login, /api/products) —
  // applied once here, never re-added inside an individual @Controller() path.
  app.setGlobalPrefix('api');

  // origins come from CORS_ORIGINS (see configuration.ts) — no wildcard '*'.
  // A deployed frontend must be added to that env var, never by loosening
  // this call.
  app.enableCors({
    origin: configService.get<string[]>('cors.origins'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global request-body validation for every DTO in the app:
  // - whitelist: strips any property not declared on the DTO.
  // - forbidNonWhitelisted: rejects the request (400) instead of silently
  //   stripping when an undeclared property is present — this is what stops
  //   a client from smuggling extra fields (e.g. a role, an isActive flag)
  //   into a body a use case never asked for.
  // - transform: converts plain JSON into real DTO class instances (with
  //   `@Type(() => Number)`-style coercion applied) before a controller
  //   method ever sees them.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('app.port') ?? 3000;
  await app.listen(port);
}
void bootstrap();
