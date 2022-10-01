import httpProxy from "http-proxy";


//const url = "https://stream3.allsportsdaily.xyz/hls/fly.m3u8";
const referer = "https://allsportsdaily.co/"
const baseUrl = "https://stream3.allsportsdaily.xyz/hls";


var proxy = httpProxy.createProxyServer({
    target: baseUrl,
    secure: false,
    headers: {
        "Referer" : referer
    }
}).listen(8080);
