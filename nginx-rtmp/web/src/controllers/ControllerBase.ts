import * as express from 'express';
import App from '../App';

type ControllerOptions = {
    router?: express.Router,
};

abstract class ControllerBase {

    private _router: express.Router;
    protected app: App | null = null;

    constructor(options?: ControllerOptions) {
        this._router = options?.router ?? express.Router();

    }

    protected onGet?: (request: express.Request, response: express.Response) => Promise<void> | void;
    protected onPost?: (request: express.Request, response: express.Response) => Promise<void> | void;
    protected onDelete?: (request: express.Request, response: express.Response) => Promise<void> | void;
    protected onPut?: (request: express.Request, response: express.Response) => Promise<void> | void;


    public initialize(app: App, path: string) {
        this.app = app;

        this.onInitializeRoutes(this._router, path);
    }

    public getRouter(): express.Router {
        return this._router;
    }


    protected onInitializeRoutes(router: express.Router, path: string) {
        if (this.onGet) {
            router.get(path, this.onGet);
        }

        if (this.onPost) {
            router.post(path, this.onPost);
        }

        if (this.onDelete) {
            router.delete(path, this.onDelete);
        }

        if (this.onPut) {
            router.put(path, this.onPut);
        }

    }
}

export default ControllerBase;

