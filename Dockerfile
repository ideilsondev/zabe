# Etapa 1: Build da aplicação
FROM node:18-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build

# Etapa 2: Servir a aplicação estática
FROM nginx:stable-alpine

# Copiar os arquivos buildados da etapa anterior para o diretório padrão do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80 para acesso HTTP
EXPOSE 80

# Comando padrão para rodar o nginx em foreground
CMD ["nginx", "-g", "daemon off;"]
