FROM node:20-alpine

# Instalamos dependencias de compilación si son necesarias
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./
RUN npm install

# COPIAMOS EL CÓDIGO Y CAMBIAMOS EL DUEÑO
# El flag --chown=node:node es la clave aquí
COPY --chown=node:node . .

# Exponer el puerto
EXPOSE 5100

# Ahora sí, cambiamos al usuario node
USER node

CMD ["node", "--watch", "server.js"]