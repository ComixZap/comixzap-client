FROM node:alpine

ADD . /app
WORKDIR /app
RUN npm i
RUN npx webpack
RUN npm i express

ENTRYPOINT node server
