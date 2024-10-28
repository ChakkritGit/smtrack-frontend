FROM node:23-alpine as build-stage

RUN apk add \
    python3 \
    make \
    g++ \
    libc6-compat \
    cairo-dev \
    pango-dev \
    giflib-dev \
    jpeg-dev

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN rm -rf node_modules
RUN rm -rf .env.development
RUN rm -rf .env.production

RUN apk del python3 make g++ libc6-compat cairo-dev pango-dev giflib-dev jpeg-dev

FROM nginx:stable-perl

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

EXPOSE 7258

CMD ["nginx", "-g", "daemon off;"]
