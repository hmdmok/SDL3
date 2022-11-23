FROM node:17-alpine

WORKDIR /SDL3

COPY . .

RUN npm install