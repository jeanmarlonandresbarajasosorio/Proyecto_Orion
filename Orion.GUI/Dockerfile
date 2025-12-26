# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- LÍNEA AGREGADA PARA FORZAR EL PUERTO ---
ENV VITE_API_URL=http://localhost:5000/api

RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]