FROM node:alpine

WORKDIR /user/src/app

COPY . .

RUN npm run build

USER node

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

