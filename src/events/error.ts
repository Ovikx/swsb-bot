import { bot } from '../core/bot';
let dateTime = new Date()

export default bot.on('error', async (err) => {
    console.log(dateTime, ': ', err);
});