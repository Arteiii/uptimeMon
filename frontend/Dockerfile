FROM node:18-alpine AS base

FROM base AS builder

FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .


RUN \
    if [ -f package-lock.json ]; then npm ci; \
    else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && npm install; \
    fi

RUN npm run build

CMD ["npm", "run", "start"]
