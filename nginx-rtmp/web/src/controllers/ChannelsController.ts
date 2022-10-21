import ControllerBase from "./ControllerBase";
import { Request, Response } from "express";
import IChannelsService from "../services/IChannelsService";

class ChannelsController extends ControllerBase {

    private _channelsService: IChannelsService;

    constructor(channelsService: IChannelsService) {
        super();

        this._channelsService = channelsService;
    }

    protected get = async (request: Request, response: Response) => {
        response.send(await this._channelsService.getAll());
    }
}

export default ChannelsController;