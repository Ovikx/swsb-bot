import { bot } from '../core/bot';
import { DB } from '../core/db';

export default bot.on('guildRoleDelete', async (guild, role) => {
    // Get squadron by either leader or member role
    const squadron = await DB.getSquadronByAny(role.id);

    // Only worry about role if it is a squadron role
    if (squadron) {
        // Delete the other role
        bot.deleteRole(guild.id, squadron.leaderRole, 'Automatic squadron role deletion');
        bot.deleteRole(guild.id, squadron.memberRole, 'Automatic squadron role deletion');

        DB.removeSquadron(squadron.leaderRole);
    }
})