"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_proxy_1 = __importDefault(require("http-proxy"));
//const url = "https://stream3.allsportsdaily.xyz/hls/fly.m3u8";
const referer = "https://allsportsdaily.co/";
const baseUrl = "https://stream3.allsportsdaily.xyz/hls";
var proxy = http_proxy_1.default.createProxyServer({
    target: baseUrl,
    secure: false,
    headers: {
        "Referer": referer
    }
}).listen(8080);
