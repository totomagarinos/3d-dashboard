# ETAPA 1: Construcción
FROM oven/bun:1 AS builder

WORKDIR /app

# Copiamos package.json y el lockfile de Bun
COPY package.json bun.lock ./

# Instalamos dependencias con Bun
RUN bun install --frozen-lockfile

# Copiamos el resto del código y compilamos
COPY . .
RUN bun run build

# ETAPA 2: Servidor de producción (Nginx)
FROM nginx:alpine

# Copiamos la build de Angular
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copiamos configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]