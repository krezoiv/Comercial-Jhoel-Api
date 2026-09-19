/**
 * The single source of typed environment configuration, loaded once via
 * `ConfigModule.forRoot({ isGlobal: true, load: [configuration] })` in
 * `AppModule`. Every module reads env vars through `ConfigService.get(...)`
 * against these namespaces (`'database.host'`, `'jwt.secret'`, etc.) rather
 * than touching `process.env` directly — this is the one file that needs
 * updating when a new environment variable is introduced.
 */
export interface AppConfig {
  port: number;
  environment: string;
  /** Base pública del frontend — usada para armar URLs reales (ej. el enlace de una noticia en el mensaje de WhatsApp), nunca para nada relacionado con envío de WhatsApp en sí. */
  frontendUrl: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: number;
}

export interface CorsConfig {
  origins: string[];
}

export interface PushConfig {
  /** Clave pública VAPID — no es secreta, se expone al frontend vía `GET /public-news-subscriptions/push/vapid-public-key`. `null` = Web Push no configurado todavía. */
  vapidPublicKey: string | null;
  /** Clave privada VAPID — nunca sale de este proceso; firma cada envío, jamás se expone a ningún cliente. */
  vapidPrivateKey: string | null;
  /** Contacto exigido por el protocolo Web Push (RFC 8292) — un `mailto:` real, no un dato inventado. */
  vapidSubject: string;
}

export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    environment: process.env.NODE_ENV ?? 'development',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:4200',
  } satisfies AppConfig,
  cors: {
    origins: (process.env.CORS_ORIGINS ?? 'http://localhost:4200')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  } satisfies CorsConfig,
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    name: process.env.DATABASE_NAME ?? 'comercial_jhoel',
  } satisfies DatabaseConfig,
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me',
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '86400', 10),
  } satisfies JwtConfig,
  push: {
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY ?? null,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY ?? null,
    vapidSubject: process.env.VAPID_SUBJECT ?? 'mailto:libreria.jhoel@grupoki.com',
  } satisfies PushConfig,
});
