# Build stage: compile static assets without dev dependencies
FROM node:26-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY index.html vite.config.js ./
COPY src ./src
COPY data ./data

RUN npm run build

# Runtime stage: slim Ubuntu nginx image
FROM ubuntu/nginx:1.24-24.04_beta

COPY --from=builder /app/dist /var/www/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
