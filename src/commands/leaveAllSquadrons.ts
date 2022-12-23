import Eris, { Constants } from 'eris';
import { DB } from '../core/db';
import important from '../utils/resources/important.json';
import colors from '../utils/resources/colors.json';
import { createAuthor } from '../utils/helpers/misc';

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {
        await interaction.acknowledge();

        const caller = interaction.member;
        if (!caller) {
            throw 'Failed to fetch caller'
        }

        // Check if caller is a squadron leader
        let isLeader = false;
        let leaderRole = '';
        const leaderRoles = await DB.getSquadronRoles('leaderRole');
        const memberRoles = await DB.getSquadronRoles('memberRole');
        let rolesToRemove: string[] = []
        for (const role of caller.roles) {
            if (leaderRoles.includes(role)) {
                isLeader = true;
                leaderRole = role;
                break;
            }

            if (memberRoles.includes(role)) {
                rolesToRemove.push(role)
            }
        }

        // Caller must be a squadron member
        if (isLeader) {
            throw 'Squadron leader';
        }

        // If user has no roles to remove, then they are not in a squadron
        if (rolesToRemove.length == 0) {
            throw 'No squadron roles';
        }

        let roleMentions: string[] = [];
        for (const role of rolesToRemove) {
            roleMentions.push(`<@&${role}>`);
            bot.removeGuildMemberRole(important.supportGuildId, caller.id, role);
        }

        const joinedRoles = roleMentions.join(', ');
        await interaction.createFollowup({
            embeds: [
                {
                    title: '✅ Roles removed!',
                    description: `The following squadron roles have been removed: ${joinedRoles}`,
                    color: +colors.success,
                    author: createAuthor(interaction)
                }
            ]
        });

    } catch (e) {
        console.log(e);
        if (!interaction.acknowledged) {
            await interaction.acknowledge(64);
        }

        let errorStr = 'An unexpected error occurred.';
        if (typeof e == 'string') {
            switch (e) {
                case 'Squadron leader':
                    errorStr = 'You are a squadron leader; contact an admin if you want to delete your squadron.';
                    break;
                case 'No squadron roles':
                    errorStr = 'You have no squadron roles to remove.';
                    break;
            }
        }

        await interaction.createFollowup({
            content: errorStr,
            flags: 64
        });
    }
}

module.exports = {
    config: {
        type: Constants.ApplicationCommandTypes.CHAT_INPUT,
        name: 'leave-all-squadrons',
        description: 'Removes all of your squadron roles'
    },
    action: command
}