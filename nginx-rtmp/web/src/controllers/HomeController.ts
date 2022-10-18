import { Request, Response, Router } from "express";
import ControllerBase from "./ControllerBase";

class HomeController extends ControllerBase {
    
    onGet = (request: Request, response : Response) => {
        
        response.sendFile("index.html", {root: './src/public/Home'});
    };

    onPost = (request: Request, response : Response) => {
        let b = request.body;

        response.send(b);
    };

}

export default HomeController;