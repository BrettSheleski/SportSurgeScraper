import App from './App';
import ChannelsController from './controllers/ChannelsController';
import EditChannelController from './controllers/EditChannelController';
import HomeController from './controllers/HomeController';
import SetChannelController from './controllers/SetChannelController';

const app = new App({
    controllers: {
        "/" : new HomeController(),
        "/Channels": new ChannelsController(),
        "/Channels/:name" : new EditChannelController()
    },
    port: 5000
});

app.listen();
