import Channel from "../models/Channel";

interface INginxHelper {
    reload : () => Promise<void>;
    writeChannel : (channel: Channel) => Promise<void>
}

export default INginxHelper;