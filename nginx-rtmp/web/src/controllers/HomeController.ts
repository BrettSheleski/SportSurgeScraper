import { Request, Response, Router } from "express";
import ControllerBase from "./ControllerBase";

class HomeController extends ControllerBase {
    
    get = (request: Request, response : Response) => {
        
        response.sendFile("index.html", {root: './src/public/Home'});
    };

    post = (request: Request, response : Response) => {
        let b = request.body;

        response.send(b);
    };

}

export default HomeController;