FROM tiangolo/nginx-rtmp

RUN apt-get update && apt-get install -y ffmpeg nodejs npm
RUN apt-get install ffmpeg
RUN mkdir -p /config/channels

COPY nginx.conf /etc/nginx/nginx.conf
COPY www /config/www

RUN npm install /config/www

EXPOSE 1935
CMD ["nginx", "-g", "daemon off;"]
