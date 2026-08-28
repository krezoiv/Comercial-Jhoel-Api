# syntax=docker/dockerfile:1

ARG NODE_VERSION=24-alpine

# Base: shared by every stage that needs to run `npm install` (bcrypt needs
# python3/make/g++ to compile its native binding).
FROM node:${NODE_VERSION} AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS production-dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Used by docker-compose for local development (bind-mounted source, hot reload).
FROM dependencies AS development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

FROM dependencies AS build
COPY . .
RUN npm run build

# Minimal runtime image: no build toolchain, no dev dependencies, non-root user.
FROM node:${NODE_VERSION} AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs && chown -R nestjs:nodejs /app
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main.js"]
