FROM node:alpine

WORKDIR /user/src/app

COPY . .

RUN npm install --save-dev @nestjs/cli

RUN chmod -R 777 dist && npm run build

USER node

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
