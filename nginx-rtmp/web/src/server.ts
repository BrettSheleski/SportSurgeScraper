import App from './App';
import AddChannelController from './controllers/AddChannelController';
import ChannelsController from './controllers/ChannelsController';
import EditChannelController from './controllers/EditChannelController';
import HomeController from './controllers/HomeController';
import SetChannelController from './controllers/SetChannelController';
import JsonChannelsService from './services/JsonChannelsService';
import NginxHelper from './services/NginxHelper';

const channelsSerivce = new JsonChannelsService("channels.json");
const nginxHelper = new NginxHelper("/config/channels");

const app = new App({
    controllers: {
        "/" : new HomeController(),
        "/Channels": new ChannelsController(channelsSerivce),
        "/Channels/Add" : new AddChannelController(channelsSerivce, nginxHelper),
        "/Channels/:name" : new EditChannelController(channelsSerivce, nginxHelper)
    },
    port: 5000
});

app.listen();
