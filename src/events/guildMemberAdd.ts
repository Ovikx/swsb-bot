import Eris from "eris";
import { bot } from '../core/bot';
import { outdent, sleep } from "../utils/helpers/misc";
import important from '../utils/resources/important.json';

const REQUIRED_ROLES = ['828478396769239041', '828351764625358849'];
const CHANNEL_ID = '828354112147030026';
const RULES_ID = '828356780706496532';
const VERIFY_ID = '828348454887489559';
const MINUTES = 3;

// Checks if a given member has the required roles
function memberSituated(member: Eris.Member): boolean {
    for (const role of REQUIRED_ROLES) {
        if (!member.roles.includes(role)) {
            return false;
        }
    }

    return true;
}

export default bot.on('guildMemberAdd', async (guild, member) => {
    await sleep(1000*60*MINUTES);
    const newMember = await guild.getRESTMember(member.id);
    if (!newMember) {
        throw 'Unable to fetch member that just joined; must have left';
    }

    if (!memberSituated(newMember)) {
        console.log('member not situated');
        const msg = outdent
        `<@${member.id}> Having trouble joining the server? Do the following to gain access to the rest of the server:
        • Click the check mark in <#${RULES_ID}> (https://discord.com/channels/828348454887489556/828356780706496532/828481640438300682)
        • Use \`/verify\` in <#${VERIFY_ID}>
        Feel free to contact an admin if you are having trouble.`
        bot.createMessage(CHANNEL_ID, msg);
    } else {
        console.log('member situated');
    }
});