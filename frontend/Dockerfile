# Etapa 1: Build del frontend con Vite
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# copia todo el código del frontend
COPY . .

# Vite lee automáticamente .env y .env.production
RUN npm run build


# Etapa 2: Nginx sirve el contenido estático
FROM nginx:alpine

# Copiamos el build
COPY --from=build /app/dist /usr/share/nginx/html

# Config de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
