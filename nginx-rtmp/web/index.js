"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3001;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded());
app.use(express_1.default.static('public', { index: false, extensions: ['html'] }));
app.get('/toto', (req, res) => {
    res.send('Hello toto');
});
app.post('/set-channel', (req, res) => {
    let data = req.body;
    let channel = {
        name: data.name,
        url: data.url
    };
    let channelConf = `
application ${channel.name} {
    live on;
    record off;
    exec_pull ffmpeg -i "${channel.url}" -c:v h264 -preset:v ultrafast  -c:a aac -f flv rtmp://localhost:1935/$app/stream;
}`.trim();
    fs_1.default.writeFile(`config/${channel.name}.conf`, channelConf, err => {
        if (err) {
            console.error(err);
        }
    });
    res.send(channelConf);
    console.log(channel);
});
app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
});
