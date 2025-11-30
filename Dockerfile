FROM node:20-alpine

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json / pnpm-lock / yarn.lock
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el resto del código
COPY . .

# Si usas build de TypeScript a dist:
# RUN npm run build

# Exponer puerto Nest (ajusta si no usas 3000)
EXPOSE 3000

# Comando final (usa build si ya compilas a dist)
# CMD ["node", "dist/main.js"]
CMD ["npm", "run", "start:prod"]
