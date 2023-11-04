FROM node:20.8-alpine3.17

RUN apk update && apk upgrade

RUN apk add --no-cache udev ttf-freefont chromium nss freetype harfbuzz ca-certificates

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true \
    CHROME_PATH=/usr/bin/chromium-browser \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY . .
ARG NX_NON_NATIVE_HASHER=true
RUN npm install -g npm@10.2.0
RUN npm install puppeteer@20.0.0
RUN npm install
