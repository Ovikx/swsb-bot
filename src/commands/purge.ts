import Eris, { Constants } from 'eris';
import important from '../utils/resources/important.json';
import { DB } from '../core/db';
import colors from '../utils/resources/colors.json';
import { createAuthor, isAdmin } from '../utils/helpers/misc';

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {
        await interaction.acknowledge();

        const caller = interaction.member;
        if (!caller) {
            throw 'Failed to fetch caller';
        }

        // Admin-only command
        if (!isAdmin(caller)) {
            throw 'Not admin';
        }

        const squadrons = await DB.getAllSquadrons();
        const roles = bot.guilds.get(interaction.guildID ?? '')?.roles;

        // Check that roles collection exists
        if (!roles) {
            throw 'Could not fetch roles';
        }

        let numPurged =  0;

        // Purge squadrons
        for (const squadron of squadrons) {
            if (!roles.has(squadron.leaderRole) || !roles.has(squadron.memberRole)) {
                console.log(`purging ${squadron.leaderRole}`);
                numPurged++;
                DB.removeSquadron(squadron.leaderRole);
            }
        }

        await interaction.createFollowup({
            embeds: [
                {
                    title: '✅ Squadrons purged!',
                    description: `${numPurged} squadrons have been purged because one of their roles weren't found.`,
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
                case 'Failed to fetch caller':
                    errorStr = `Unable to fetch the command caller\'s details. Contact <@${important.ownerId}>.`;
                    break;
                case 'Not admin':
                    errorStr = 'You must be an admin to purge squadrons.';
                    break;
                case 'Could not fetch roles':
                    errorStr = 'Could not fetch the server\'s roles.';
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
        name: 'purge',
        description: '[ADMIN USE ONLY] Removes any squadrons with nonexistent roles'
    },
    action: command
}