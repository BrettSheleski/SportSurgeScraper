import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import ControllerBase from "./ControllerBase";

class EditChannelController extends ControllerBase{

    protected onGet = async (request: Request, response: Response) => {
        response.send(request.params);
    }

    protected onPut = async (request: Request, response: Response) => {
        response.send(request.params);
    }

    protected onPost = async (request: Request, response: Response) => {
        response.send(request.params);
    }
}

export default EditChannelController;