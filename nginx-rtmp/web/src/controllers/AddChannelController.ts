import ControllerBase from "./ControllerBase";
import { Request, Response } from "express";
import IChannelsService from "../services/IChannelsService";
import Channel from "../models/Channel";
import INginxHelper from "../services/INginxHelper";
import NginxHelper from "../services/NginxHelper";

class AddChannelController extends ControllerBase {

    private _channelsService: IChannelsService;
    private _nginx: INginxHelper;

    constructor(channelsService: IChannelsService, nginx: INginxHelper) {
        super();

        this._channelsService = channelsService;
        this._nginx = nginx;
    }

    protected post = async (request: Request, response: Response) => {
        let channel: Channel = request.body;

        await this._channelsService.save(channel);

        await this._nginx.writeChannel(channel);

        await this._nginx.reload();

        response.sendStatus(200);
    }
}

export default AddChannelController;