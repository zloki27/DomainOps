FROM node:22-bookworm-slim

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
