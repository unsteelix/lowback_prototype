FROM node:16
WORKDIR /app
COPY . .
RUN yarn install && yarn build
CMD ["yarn", "serve"]
EXPOSE 3200
