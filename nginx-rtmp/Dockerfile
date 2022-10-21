FROM tiangolo/nginx-rtmp

RUN apt-get update && apt-get install -yq ffmpeg curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_lts.x  | bash -
RUN apt-get -y install nodejs
RUN npm install -g ts-node

RUN mkdir -p /config/channels

COPY nginx.conf /etc/nginx/nginx.conf
COPY web /config/web

WORKDIR /config/web
RUN npm install

COPY startup.sh /startup.sh

EXPOSE 5000 1935
CMD ["/startup.sh"]
