import * as childProcess from "child_process";
import Channel from "../models/Channel";
import INginxHelper from "./INginxHelper";

import * as fs from 'fs';
import { promisify } from "util";

class NginxHelper implements INginxHelper {


    private _channelsDir: string;

    constructor(channelsDir: string) {
        this._channelsDir = channelsDir;
    }

    async reload() {
        childProcess.exec("nginx -s reload");
    }

    async writeChannel(channel: Channel) {

        let headers = "";

        if (channel.headers) {
            for (let key in channel.headers) {
                headers += `-headers "${key}: ${channel.headers[key]}`;
            }
        }

        let config = `
application ${channel.name} {
    live on;
    record off;
    exec_pull ffmpeg -i "${channel.url}" ${headers} -c:v h264 -preset:v ultrafast -c:a aac -f flv rtmp://localhost:1935/$app/stream;
}
`.trim();

        await promisify(fs.writeFile)(`${this._channelsDir}/${channel.name}.conf`, config);

    }

    async removeChannel(channel: string | Channel) {

    }
}

export default NginxHelper;