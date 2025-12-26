# ===== Backend Dockerfile =====
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json desde orion.api
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el contenido de orion.api al contenedor
COPY . .

# Exponer el puerto del backend
EXPOSE 5000

# Iniciar el backend apuntando al server.js
CMD ["node", "server.js"]
