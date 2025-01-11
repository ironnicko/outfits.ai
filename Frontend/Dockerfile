
FROM node:latest AS build


WORKDIR /app


COPY package.json yarn.lock ./


RUN yarn install --frozen-lockfile


COPY . .


RUN yarn build


FROM node:latest AS deploy


WORKDIR /app


COPY --from=build /app/dist ./dist


RUN yarn global add serve


EXPOSE 3000


CMD ["serve", "-s", "dist", "-l", "3000"]