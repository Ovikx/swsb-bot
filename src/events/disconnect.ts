import Eris from "eris";
import { bot } from '../core/bot';

export default bot.on('disconnect', async () => {
    console.log('Disconnected :(');
});