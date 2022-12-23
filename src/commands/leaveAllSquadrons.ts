import Eris, { Constants } from 'eris';
import { DB } from '../core/db';
import important from '../utils/resources/important.json';
import colors from '../utils/resources/colors.json';
import { createAuthor } from '../utils/helpers/misc';

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {
        await interaction.acknowledge();

        // Check that command was called from a server
        const guildId = interaction.guildID;
        if (!guildId) {
            throw 'Server invoke only';
        }

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
            bot.removeGuildMemberRole(guildId, caller.id, role);
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
                    errorStr = 'You are a squadron leader; contact an admin if you want to delete your squadron or transfer ownership to someone else.';
                    break;
                case 'No squadron roles':
                    errorStr = 'You have no squadron roles to remove.';
                    break;
                case 'Server invoke only':
                    errorStr = 'You can only use this command from a server.';
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