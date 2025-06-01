import { bot } from '../core/bot';

export default bot.on('error', async (err) => {
    console.log(Date(), ': ', err);
});