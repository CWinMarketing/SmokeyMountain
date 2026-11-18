FROM node:22-alpine

WORKDIR /app

# Install dependencies first for better layer caching. This is an npm
# workspace root (apps/backend is the actual Medusa app) so both
# package.json files are needed for `npm install` to resolve correctly.
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/package.json
RUN npm install

COPY . .

WORKDIR /app/apps/backend

EXPOSE 9000 9001

# Runs migrations before starting so `docker compose up` on a fresh
# volume is always in a working state; re-running migrations is a no-op
# once the schema is current. Seeding is a separate, explicit step (see
# README) so it never runs twice against existing data.
CMD ["sh", "-c", "npx medusa db:migrate && npm run dev"]
