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

    protected get?: (request: express.Request, response: express.Response) => Promise<void> | void;
    protected post?: (request: express.Request, response: express.Response) => Promise<void> | void;
    protected delete?: (request: express.Request, response: express.Response) => Promise<void> | void;
    protected put?: (request: express.Request, response: express.Response) => Promise<void> | void;


    public initialize(app: App, path: string) {
        this.app = app;

        this.onInitializeRoutes(this._router, path);
    }

    public getRouter(): express.Router {
        return this._router;
    }


    protected onInitializeRoutes(router: express.Router, path: string) {
        if (this.get) {
            router.get(path, this.get);
        }

        if (this.post) {
            router.post(path, this.post);
        }

        if (this.delete) {
            router.delete(path, this.delete);
        }

        if (this.put) {
            router.put(path, this.put);
        }

    }
}

export default ControllerBase;

