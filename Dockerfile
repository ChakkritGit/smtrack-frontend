FROM oven/bun:latest as build

WORKDIR /build

COPY . .

RUN bun i
RUN bun run build

FROM nginx:stable-perl

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /build/dist/ /usr/share/nginx/html

EXPOSE 7258

CMD [ "nginx", "-g", "daemon off;" ]