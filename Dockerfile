FROM clajtayl/dmdii-gulp as builder

WORKDIR /app

ADD . /app

RUN npm install

RUN npm rebuild node-sass --force

RUN npm link gulp

RUN gulp build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/bower_components /usr/share/nginx/html/bower_components
