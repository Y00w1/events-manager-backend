FROM node:20-alpine

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json / pnpm-lock / yarn.lock
COPY package*.json ./

# Instalar TODAS las dependencias (incluye devDependencies: typescript, nest-cli, etc.)
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript a dist (MUY IMPORTANTE)
RUN npm run build

# Exponer puerto Nest
EXPOSE 3000

# Ejecutar el build compilado
CMD ["node", "dist/main.js"]
# (equivalente a tu start:prod, pero ya sabemos que dist está actualizado)
