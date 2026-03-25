# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# --- PASO DE DIAGNÓSTICO (Opcional pero recomendado ahora) ---
# Esto imprimirá en tu terminal de VS Code la ruta real de los archivos
RUN ls -R /app/dist

# Stage 2: Nginx
FROM nginx:stable-alpine
# Borramos el contenido por defecto para evitar conflictos
RUN rm -rf /usr/share/nginx/html/*

# RUTA PARA ANGULAR MODERNO (2025/2026)
# La mayoría de las versiones actuales usan /browser al final
COPY --from=build /app/dist/Gestor_de_permisos_laborals/browser /usr/share/nginx/html

# Si después de esto sigues viendo el 403, prueba cambiando la línea de arriba por:
# COPY --from=build /app/dist/gestor-de-permisos-laborals /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]