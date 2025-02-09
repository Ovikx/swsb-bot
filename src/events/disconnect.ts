import Eris from "eris";
import { bot } from '../core/bot';

let dateTime = new Date()

export default bot.on('disconnect', async () => {
    console.log(dateTime, ': Disconnected :(');
});