# Multi Stage build process

# Build Stage

FROM node:18-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./


RUN npm install

COPY . .

RUN npm run build

# Production Stage

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=base /app/dist ./dist

COPY package.json package-lock.json ./

ENV NODE_ENV=production

RUN npm install --production

EXPOSE 9090

CMD ["npm", "start"]
