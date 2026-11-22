# Build stage: compile static assets without dev dependencies
FROM node:26-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY index.html vite.config.js ./
COPY src ./src
COPY data ./data

RUN npm run build

# Runtime stage: slim Ubuntu 26.04 nginx rock image
FROM ubuntu/nginx:1.28-26.04_edge

COPY --from=builder /app/dist /var/www/html

EXPOSE 80
