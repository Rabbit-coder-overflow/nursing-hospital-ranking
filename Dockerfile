# Build stage: compile static assets without dev dependencies
FROM node:26-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY index.html vite.config.js ./
COPY src ./src
COPY data ./data

RUN npm run build

# Runtime stage: latest official nginx slim image
FROM nginx:alpine-slim

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
