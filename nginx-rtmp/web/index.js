"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.static('public', { index: false, extensions: ['html'] }));
app.get('/toto', (req, res) => {
    res.send('Hello toto');
});
app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
});
