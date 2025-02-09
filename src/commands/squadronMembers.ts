import Eris, { Constants } from 'eris';
import { DB } from '../core/db';
import { createAuthor } from '../utils/helpers/misc';
import colors from '../utils/resources/colors.json';
import important from '../utils/resources/important.json';
import { Squadron } from '../utils/types/types';

/**
 * Returns the member role ID associated with the leader role
 * @param leaderRole Leader role ID
 * @returns Member role ID associated with the leader role
 */
async function getMemberRoleByLeader(leaderRole: string): Promise<string | null> {
    const squadrons = await DB.getAllSquadrons();
    for (const squadron of squadrons) {
        if (squadron.leaderRole == leaderRole) {
            return squadron.memberRole;
        }
    }

    return null;
}

/**
 * Parses an array of Member objects from given Guild into an array of strings
 * @param guild Guild object
 * @returns Array of parsed members
 */
function parseSquadronMembers(guild: Eris.Guild, squadronRole: string): string[] {
    let res: string[] = [];
    for (const [memberId, member] of guild.members) {
        if (member.roles.includes(squadronRole)) {
            res.push(`<@${memberId}> - ${`${member.username}#${member.discriminator}`}`);
        }
    }
    
    if (res.length == 0) {
        res.push('No members in your squadron...');
    }

    return res;
}

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {
        await interaction.acknowledge();

        const caller = interaction.member;
        if (!caller) {
            throw 'Failed to fetch caller'
        }

        // Check if the user has a member/leader role
        const leaderRoles = await DB.getSquadronRoles('leaderRole');
        const memberRoles = await DB.getSquadronRoles('memberRole');
        let callerSquadron: string | null = null;
        for (const role of caller.roles) {
            if (leaderRoles.includes(role)) {
                callerSquadron = await getMemberRoleByLeader(role);
                break;
            }
            if (memberRoles.includes(role)) {
                callerSquadron = role;
            }
        }

        // Process options
        if (interaction.data.options?.[0] != undefined) {
            callerSquadron = (interaction.data.options?.[0] as any).value as string;
            if (!leaderRoles.includes(callerSquadron) && !memberRoles.includes(callerSquadron)) {
                throw 'Invalid squadron';
            }
            if (leaderRoles.includes(callerSquadron)) {
                callerSquadron = await getMemberRoleByLeader(callerSquadron);
            }
        }
        
        if (!callerSquadron) {
            throw 'Not in squadron'
        }

        // Fetch the main server
        const supportGuild = bot.guilds.get(important.supportGuildId);
        if (!supportGuild) {
            throw 'Guild fetching error';
        }

        // Collect squadron members
        const parsedMembers = parseSquadronMembers(supportGuild, callerSquadron).join('\n');

        // Send response
        await interaction.createFollowup({
            embeds: [
                {
                    title: 'Members in your squadron',
                    description: parsedMembers,
                    color: +colors.blue,
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
                case 'Failed to fetch caller':
                    errorStr = `Unable to fetch the command caller\'s details. Contact <@${important.maintainerId}>.`;
                    break;
                case 'Not in squadron':
                    errorStr = 'You have to be in a squadron to use this command.';
                    break;
                case 'Guild fetching error':
                    errorStr = `An error occurred while trying to fetch this server from the cache. Contact <@${important.maintainerId}>`;
                    break;
                case 'Invalid squadron':
                    errorStr = 'You entered an invalid squadron role. Type in the squadron\'s leader or member role.';
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
        name: 'squadron-members',
        description: 'View a list of members in your squadron',
        options: [
            {
                type: Constants.ApplicationCommandOptionTypes.ROLE,
                name: 'squadron',
                description: 'The leader/member role of the squadron to query',
                required: false
            }
        ]
    },
    action: command
}