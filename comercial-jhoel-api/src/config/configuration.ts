export interface AppConfig {
  port: number;
  environment: string;
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

export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    environment: process.env.NODE_ENV ?? 'development',
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
});
