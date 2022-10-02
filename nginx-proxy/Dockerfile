FROM nginx

ENV PROXY_HOST=
ENV PROXY_DEFAULT_PATH=
ENV PROXY_HEADER_Referer=

COPY server.conf /etc/nginx/conf.d/default.conf
COPY proxy.conf /proxy.conf
COPY 100-setup-proxy.sh /docker-entrypoint.d/
COPY config.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]