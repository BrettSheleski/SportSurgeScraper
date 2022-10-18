import * as childProcess from "child_process";
import Channel from "../models/Channel";
import INginxHelper from "./INginxHelper";

class NginxHelper implements INginxHelper {
    async reload() {
        childProcess.exec("nginx -s reload");
    }

    async writeChannel(channel: Channel) {

    }
}

export default NginxHelper;