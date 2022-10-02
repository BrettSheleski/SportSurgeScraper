#! /bin/bash

proxyHost="${PROXY_HOST}"
proxyDefaultPath="${PROXY_DEFAULT_PATH}"
proxyReferer="${PROXY_HEADER_Referer}"

cat > /proxy.conf <<EOL
location / {
    proxy_pass ${proxyHost};
    proxy_set_header Referer ${proxyReferer};
} 
EOL


cat >> /proxy.conf <<EOL
location /stream {
    return 302 ${proxyDefaultPath};
} 
EOL