# Build stage: compile static assets without dev dependencies
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY index.html vite.config.js ./
COPY src ./src
COPY data ./data

RUN npm run build

# Runtime stage: slim Ubuntu image serving static files via nginx-light
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx-light ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist /var/www/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
