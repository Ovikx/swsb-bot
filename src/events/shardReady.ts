import { bot } from '../core/bot';

export default bot.on('shardReady', async (id) => {
    console.log(`Shard ${id} ready!`);
});