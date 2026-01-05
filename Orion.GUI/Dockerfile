# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Declaramos el argumento que recibiremos desde fuera
ARG VITE_API_URL
# Lo convertimos en ENV para que el proceso de build lo vea
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .

# Al ejecutar build, Vite buscará VITE_API_URL y lo inyectará en los archivos finales
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]