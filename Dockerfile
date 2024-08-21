# Stage 0: Base image
FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

# Stage 1: Build the application
FROM base AS builder
WORKDIR /app
COPY . .
RUN bun run build

FROM oven/bun:1 AS dependencies
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --production 

# Stage 2: Create the final image
FROM oven/bun:1-slim AS runner
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/database/schema.sql ./database/schema.sql
COPY --from=dependencies /app/node_modules ./node_modules


ENV NODE_ENV=production
ENV BODY_SIZE_LIMIT=Infinity

EXPOSE 3000
CMD ["--bun","./build/index.js"]
