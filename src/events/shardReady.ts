import { bot } from '../core/bot';
let dateTime = new Date()

export default bot.on('shardReady', async (id) => {
    console.log(dateTime, `: Shard ${id} ready!`);
});