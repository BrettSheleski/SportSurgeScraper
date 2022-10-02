# Sportsurge Scraper

Scrapes Sportsurge to get feeds. Use the `nginx-proxy` Docker container (included) to make a reverse proxy for reasons.

## nginx-proxy Docker container

Use this Docker image to setup a reverse proxy to do stuff.

### Build the Docker image

Use the `docker build` command to build the image.  Use the `-t` parameter to specify a name/tag.

```
cd nginx-proxy
docker build . -t ss-nginx-proxy
```

Create a container using the built image.  Here's an example.

```
---
version: "2.1"
services:
  code-server:
    image: ss-nginx-proxy
    container_name: MyStream1
    environment:
      - PROXY_HOST=http://host-of-stream/
      - PROXY_DEFAULT_PATH=/path/to/stream.m3u8
      - PROXY_HEADER_Referer=http://example.org/
    ports:
      - 9886:80
    restart: unless-stopped
```

The Docker image will also create a `/stream` endpoint which redirects to the specified .m3u8 stream file.  This way if/when configuration changes to handle a new stream one could always use the constant `/stream` endpoint without needing to reconfigure clients.