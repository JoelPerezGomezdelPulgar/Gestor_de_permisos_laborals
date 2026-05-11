# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# HACK: --legacy-peer-deps evita el error 'eresolve' que te dio antes
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --configuration=production

# Stage 2: Servidor
FROM nginx:stable-alpine
# IMPORTANTE: Necesitas un archivo de config para que Angular funcione
# COPY nginx.conf /etc/nginx/conf.d/default.conf 
COPY --from=build /app/dist/Gestor_de_permisos_laborals/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]