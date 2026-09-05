import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

/**
 * Turns each `CORS_ORIGINS` entry into an exact-match string or, if it
 * contains a `*`, a compiled `RegExp` — lets one entry like
 * `https://*.app.github.dev` cover every GitHub Codespaces/VS Code Ports
 * forwarded URL (a new random subdomain per codespace) without editing
 * `.env` and restarting the API every time a codespace is recreated. Exact
 * strings (e.g. `http://localhost:4200`) still match literally, unchanged
 * from before — this is additive, not a loosening of the existing rule.
 */
function compileCorsOrigins(origins: string[]): (string | RegExp)[] {
  return origins.map((entry) =>
    entry.includes('*')
      ? new RegExp(`^${entry.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`)
      : entry,
  );
}

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
  // this call. `compileCorsOrigins` only adds wildcard-*pattern* support for
  // temporary public-URL testing (e.g. Codespaces) — still never a bare '*'.
  const corsOrigins = compileCorsOrigins(configService.get<string[]>('cors.origins') ?? []);
  app.enableCors({
    origin: (origin, callback) => {
      // No Origin header at all (curl, server-to-server, same-origin) — never a browser CORS case to police.
      if (!origin) {
        callback(null, true);
        return;
      }
      const allowed = corsOrigins.some((entry) =>
        typeof entry === 'string' ? entry === origin : entry.test(origin),
      );
      // Never pass an Error here for a disallowed origin — the `cors`
      // package forwards it straight to Express's error handler (`next(err)`),
      // which this app has no CORS-specific handler for, so it would surface
      // as a raw 500 instead of the original, correct behavior: no
      // `Access-Control-Allow-Origin` header, silently blocked by the
      // browser itself, exactly like the old plain-array `origin` config
      // already did before this wildcard-matching function replaced it.
      callback(null, allowed);
    },
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
  // Explicit '0.0.0.0' (not just an implicit default) so the API accepts
  // connections forwarded from outside this machine (VS Code Ports/
  // Codespaces port sharing) — identical behavior for purely local use,
  // since '0.0.0.0' already includes 'localhost'/'127.0.0.1'.
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
