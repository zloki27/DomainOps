FROM node:22-bookworm-slim

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY scripts ./scripts
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "run", "start"]
