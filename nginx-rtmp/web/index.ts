import express, { Application, Request, Response } from 'express'

import bodyParser from 'body-parser';

import fs from 'fs';

const app: Application = express()
const port: number = 3001

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public', { index: false, extensions: ['html'] }));

app.get('/toto', (req: Request, res: Response) => {
    res.send('Hello toto')
})


type Channel = {
    name: string,
    url: string,
    headers?: Record<string, string>
}

app.post('/set-channel', (req: Request, res: Response) => {

    let data = req.body;

    let channel: Channel = {
        name : data.name,
        url : data.url
    };

    let channelConf = `
application ${channel.name} {
    live on;
    record off;
    exec_pull ffmpeg -i "${channel.url}" -c:v h264 -preset:v ultrafast  -c:a aac -f flv rtmp://localhost:1935/$app/stream;
}`.trim();

    fs.writeFile(`/config/channels/${channel.name}.conf`, channelConf, err => {
        if (err){
            console.error(err);
        }
    });

    res.send(channelConf);

    console.log(channel);
});

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})
