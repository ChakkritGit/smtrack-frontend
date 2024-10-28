FROM node:18.18.0-alpine as build

WORKDIR /build

COPY . .

RUN npm install

RUN npm run build

FROM nginx:stable-perl

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /build/dist/ /usr/share/nginx/html

EXPOSE 7258

CMD [ "nginx", "-g", "daemon off;" ]