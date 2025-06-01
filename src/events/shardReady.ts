import { bot } from '../core/bot';

export default bot.on('shardReady', async (id) => {
    console.log(Date(), `: Shard ${id} ready!`);
});