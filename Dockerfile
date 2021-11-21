FROM node:alpine

RUN apk add make p7zip
ADD . /app
WORKDIR /app
RUN npm config set loglevel warn
RUN npm i
ENV NODE_ENV=production
RUN make package

ENTRYPOINT node server
