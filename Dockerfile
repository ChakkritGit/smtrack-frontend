FROM nginx:stable-perl

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html

EXPOSE 7258

CMD [ "nginx", "-g", "daemon off;" ]