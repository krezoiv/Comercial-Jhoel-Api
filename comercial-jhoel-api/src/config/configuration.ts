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

export interface WhatsAppConfig {
  /** Phone Number ID de la cuenta de WhatsApp Business conectada vía Meta Cloud API. `null` = integración no configurada todavía. */
  phoneNumberId: string | null;
  /** Token de acceso permanente (System User) — nunca el token temporal de 24h del asistente de Meta. */
  accessToken: string | null;
  /** Nombre de la plantilla aprobada por Meta usada para avisos de noticias — debe tener exactamente un parámetro de cuerpo ({{1}}). */
  templateName: string | null;
  templateLanguage: string;
  apiVersion: string;
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
  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? null,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? null,
    templateName: process.env.WHATSAPP_TEMPLATE_NAME ?? null,
    templateLanguage: process.env.WHATSAPP_TEMPLATE_LANGUAGE ?? 'es',
    apiVersion: process.env.WHATSAPP_API_VERSION ?? 'v23.0',
  } satisfies WhatsAppConfig,
});
