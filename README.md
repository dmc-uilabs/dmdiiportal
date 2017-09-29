# dmdiiportal

Building docker img

docker build -t dmdiiportal-nginx .

Creating nginx docker container

"docker run --name portal-nginx -d -p 8080:80 -v <path-to-host-dir>:/usr/share/nginx/html dmdiiportal-nginx"
