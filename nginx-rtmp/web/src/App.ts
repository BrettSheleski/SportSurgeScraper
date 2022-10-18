import express, { Application, Request, Response, Router } from 'express'
import ControllerBase from './controllers/ControllerBase';

type AppOptions = {
    expressApp?: Application,
    port?: number,
    controllers?: Record<string, ControllerBase>
}

class App {
    public app: Application;
    public port: number;

    private _options: AppOptions;

    private controllers: Record<string, ControllerBase>;

    constructor(options?: AppOptions) {
        this._options = options ?? {};

        this.app = this._options.expressApp ?? express()
        this.port = options?.port ?? 2100;
        this.controllers = options?.controllers ?? {};

        this.initializeMiddlewares();
        this.initializeControllers(this.controllers);
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded());
    }

    private initializeControllers(controllers: Record<string, ControllerBase>) {

        let router: Router;
        let controller: ControllerBase;

        for (let path in controllers) {
            controller = controllers[path];
            router = controller.getRouter();

            controller.initialize(this, path);
            this.app.use('/', router);
        }
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;