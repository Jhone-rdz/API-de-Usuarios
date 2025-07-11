# Usa a imagem oficial do Node como base
FROM node:18

# Define o diretório onde o código vai rodar no container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Comando que roda sua aplicação
CMD ["node", "index.js"]
