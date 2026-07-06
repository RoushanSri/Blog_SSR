FROM node:22.23-alpine3.23
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]