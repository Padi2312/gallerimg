# Stage 0: Base image
FROM node:22 AS base
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Stage 1: Build the application
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm run build

# Stage 2: Install the dependencies
FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# Stage 3: Create the final image
FROM node:22-slim AS runner
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/database/schema.sql ./database/schema.sql
COPY --from=builder /app/templates /app/templates
COPY --from=dependencies /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV BODY_SIZE_LIMIT=Infinity
# We need to set the trust proxy to true to make sure that the application works behind a reverse proxy
ENV AUTH_TRUST_HOST=true

EXPOSE 3000
CMD ["node","-r","dotenv/config","./build/index.js"]