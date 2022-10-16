FROM tiangolo/nginx-rtmp

RUN apt-get update && apt-get install -yq ffmpeg curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_lts.x  | bash -
RUN apt-get -y install nodejs

RUN mkdir -p /config/channels

COPY nginx.conf /etc/nginx/nginx.conf
COPY web /config/web

WORKDIR /config/web
RUN npm install

EXPOSE 80 1935
CMD ["nginx", "-g", "daemon off;"]
