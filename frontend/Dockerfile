FROM node:18-alpine AS base

FROM base AS builder

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .

RUN \
    elif [ -f package-lock.json ]; then npm ci; \
    else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && npm install; \
    fi


RUN npm run build

CMD ["npm", "run", "start"]
