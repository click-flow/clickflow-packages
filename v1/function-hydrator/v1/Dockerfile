FROM node:14-alpine

RUN apk update

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENV \
	NODE_ENV=production

CMD [ "node", "index.js" ]
