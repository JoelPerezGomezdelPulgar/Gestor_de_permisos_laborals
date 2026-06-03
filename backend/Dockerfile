FROM node:20-alpine

# Instalamos dependencias de compilación si son necesarias
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiamos el código
COPY --chown=node:node . .
RUN mkdir -p /app/logs

EXPOSE 5100

USER node

# Si los node_modules del host están incompletos, los instala antes de arrancar
CMD ["sh", "-c", "if ! node -e \"require('socket.io')\" 2>/dev/null; then npm install --no-audit --no-fund; fi; exec node server.js"]