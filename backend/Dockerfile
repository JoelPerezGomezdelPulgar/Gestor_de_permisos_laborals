# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Si usas TypeScript, descomenta la siguiente línea:
# RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copiar solo lo necesario del stage anterior
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app .

# Exponer el puerto que usa Express (ej. 3000)
EXPOSE 5100

# Ejecutar como usuario no-root
USER root

CMD ["node", "--watch", "server.js"]