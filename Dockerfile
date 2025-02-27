FROM node:18.20.4-alpine

WORKDIR /usr/app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build:backend

EXPOSE 3555

CMD ["node", "./dist/app.js"]