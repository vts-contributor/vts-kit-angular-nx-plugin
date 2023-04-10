FROM {{pullRegistry}}/vbs/node:16-nginx-alpine3.16
RUN npm install -g @vts-private/cli@latest

COPY cicd/configs/nginx.conf /etc/nginx/nginx.conf
COPY dist/apps/<%= name %> /usr/share/nginx/html/

WORKDIR /usr/share/nginx/html/
CMD ["/bin/sh",  "-c",  "vts-cli inject-environment-html && exec nginx -g 'daemon off;'"]
