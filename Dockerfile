FROM node:alpine

ADD . /app
WORKDIR /app
RUN npm i
ENV NODE_ENV=production
RUN npx webpack
RUN npm i express

ENTRYPOINT node server
