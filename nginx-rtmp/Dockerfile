FROM tiangolo/nginx-rtmp

RUN apt-get install ffmpeg

RUN mkdir -p /config/channels

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 1935
CMD ["nginx", "-g", "daemon off;"]