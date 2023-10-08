FROM node:20.8-alpine3.17
WORKDIR /app
COPY . .
ARG NX_NON_NATIVE_HASHER=true
RUN npm install -g npm@10.2.0
RUN npm install
