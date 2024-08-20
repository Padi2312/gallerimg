# Stage 0: Base image
FROM node:22 AS base
WORKDIR /app
COPY package.json ./
RUN npm install --force

# Stage 1: Build the application
FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Stage 2: Create the final image
FROM node:22-slim AS runner
WORKDIR /app
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["node", "./build/index.js"]
