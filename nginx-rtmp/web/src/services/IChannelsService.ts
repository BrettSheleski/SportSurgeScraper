import Channel from "../models/Channel";

interface IChannelsService {
    getByName(name: string): Promise<Channel | null>;
    save(channel: Channel): Promise<void>;
    getAll(): Promise<Array<Channel>>;
    delete(channel: Channel): Promise<void>;
}

export default IChannelsService;