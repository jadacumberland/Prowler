const helpers = require("../../helperFunctions");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Nukes the server. DO NOT USE UNLESS NECESSARY.'),
    async execute(interaction) {
        const firstMessage = await interaction.reply({content:"DON'T DO IT!!!! This cannot be undone. Everything will be destroyed.", fetchReply:true});
        const reaction = await firstMessage.react('✅');

        const collectorFilter = (reaction, user) => {
            return ['✅'].includes(reaction.emoji.name) && user.id === interaction.user.id;
        };

        firstMessage.awaitReactions({ filter: collectorFilter, max: 1, time: 10_000, errors: ['time'] })
            .then(async collected => {
                collected.first();
                const nukeMessage = await firstMessage.reply({content: 'This server will be nuked in: 5 seconds!', fetchReply:true});
                for (let i = 4; i > 0; i--) {
                    await helpers.sleep(1);
                    await nukeMessage.edit({content: `This server will be nuked in: ${i} seconds!`});
                }
                await nukeMessage.edit({content: `...Poof. This server has been nuked!`})

            })
            .catch(time => {
                firstMessage.reply('You aborted the nuke.');
            });
    },
};