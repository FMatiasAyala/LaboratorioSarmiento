# Etapa 1: Build con Node
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Config Nginx básica
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

