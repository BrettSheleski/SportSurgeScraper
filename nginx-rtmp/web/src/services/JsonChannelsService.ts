import Channel from "../models/Channel";
import IChannelsService from "./IChannelsService";

import * as fs from 'fs';
import { promisify } from "util";

type ChannelsFile = {
    channels: Array<Channel>
};


class JsonChannelsService implements IChannelsService {

    private _filePath: string;
    private _channels: ChannelsFile | null = null;

    constructor(filePath: string) {
        this._filePath = filePath;
    }

    async getByName(name: string): Promise<Channel | null> {
        await this.initialize();

        if (this._channels) {
            for (let i = 0; i < this._channels.channels.length; ++i) {
                if (this._channels.channels[i].name == name) {
                    return this._channels.channels[i];
                }
            }
        }

        return null;
    }

    private async initialize(force: boolean = false): Promise<void> {
        if (force || this._channels == null) {

            if (fs.existsSync(this._filePath)) {

                let json = await promisify(fs.readFile)(this._filePath, { encoding: "utf-8" });

                this._channels = JSON.parse(json);
            }
            else {
                this._channels = {
                    channels: []
                };
            }
        }
    }

    async save(channel: Channel): Promise<void> {
        await this.initialize();

        if (this._channels) {
            let existingChannel: Channel | null = null;
            let isExistingChannel = false;

            for (let i = 0; i < this._channels.channels.length; ++i) {
                existingChannel = this._channels.channels[i];

                if (existingChannel.name == channel.name) {
                    isExistingChannel = true;
                    this._channels.channels.splice(i, 1, channel);
                    break;
                }
            }

            if (!isExistingChannel) {
                this._channels.channels.push(channel);
            }

            await promisify(fs.writeFile)(this._filePath, JSON.stringify(this._channels), { "encoding": "utf-8" });
        }
    }
    async getAll(): Promise<Channel[]> {
        await this.initialize();

        return this._channels?.channels ?? [];
    }
    async delete(channel: Channel): Promise<void> {
        await this.initialize();

        if (this._channels) {
            let existingChannel: Channel;
            for (let i = 0; i < this._channels.channels.length; ++i) {
                existingChannel = this._channels.channels[i];

                if (existingChannel.name == channel.name) {
                    this._channels.channels.splice(i);
                    break;
                }
            }
        }
    }

}

export default JsonChannelsService;