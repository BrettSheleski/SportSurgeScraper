import ControllerBase from "./ControllerBase";
import { Request, Response } from "express";

class ChannelsController extends ControllerBase {

    protected onGet = async (request: Request, response: Response) => {
        response.send("CHANNELS!");
    }
}

export default ChannelsController;