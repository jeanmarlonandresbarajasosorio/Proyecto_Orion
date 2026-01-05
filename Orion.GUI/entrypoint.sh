#!/bin/sh
# Busca el placeholder y lo reemplaza por la variable de entorno real del sistema
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} +
nginx -g "daemon off;"