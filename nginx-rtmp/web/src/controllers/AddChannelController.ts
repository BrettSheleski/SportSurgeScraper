import ControllerBase from "./ControllerBase";
import { Request, Response } from "express";

class AddChannelController extends ControllerBase{
    protected onPost = (request: Request, response: Response) => {
        response.send(request.params);
    }
}