FROM node:20-alpine AS dependencias
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS compilacion
WORKDIR /app
ENV URL_GATEWAY=http://localhost:8080
COPY --from=dependencias /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS produccion
WORKDIR /app
RUN apk add --no-cache wget
ENV NODE_ENV=production
ENV URL_GATEWAY=http://localhost:8080
COPY --from=compilacion /app/.next ./.next
COPY --from=compilacion /app/node_modules ./node_modules
COPY --from=compilacion /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
