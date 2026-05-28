# Usamos la imagen oficial de Bun
FROM oven/bun:1 AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package.json bun.lock ./

# Instalamos las dependencias
RUN bun install --frozen-lockfile

# Copiamos el resto del código de la aplicación
COPY . .

# Configuración de entorno
ENV NODE_ENV=prod

# Exponemos el puerto de la API
EXPOSE 4000

# Comando para arrancar la API
CMD ["bun", "run", "src/server.ts"]