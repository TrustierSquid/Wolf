FROM node:20

WORKDIR /app

COPY /package*.json ./

COPY server/.env /app/.env

RUN npm install

COPY . .

# ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]