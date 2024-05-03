FROM node:21-alpine

RUN apk --no-cache add yarn

COPY . .

CMD ["yarn", "start:prod"]

EXPOSE 3000
