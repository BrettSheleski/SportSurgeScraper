import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import Channel from "../models/Channel";
import IChannelsService from "../services/IChannelsService";
import INginxHelper from "../services/INginxHelper";
import ControllerBase from "./ControllerBase";

class EditChannelController extends ControllerBase {

    private _channelsService: IChannelsService;
    private _nginx: INginxHelper;

    constructor(channelsService: IChannelsService, nginx: INginxHelper) {
        super();

        this._channelsService = channelsService;
        this._nginx = nginx;
    }

    protected get = async (request: Request, response: Response) => {
        let channel = await this._channelsService.getByName(request.params.name);

        if (channel) {
            response.send(channel);
        }
        else {
            response.sendStatus(404);
        }
    }

    protected post = async (request: Request, response: Response) => {

        let channel = await this._channelsService.getByName(request.params.name);

        if (channel) {
            channel = <Channel>request.body;

            await this._channelsService.save(channel);
            await this._nginx.writeChannel(channel);
            await this._nginx.reload();

            response.sendStatus(200);
        }
        else {
            response.sendStatus(404);
        }
    }

}

export default EditChannelController;