const helpers = require("../../helperFunctions");
const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeid')
        .setDescription('Removes username from your profile')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('Game to remove username for')
                .setRequired(true)),
    async execute(interaction) {
        // 1. Get username/game/id from user
        const jsonLocation = `jsons/${interaction.guild.id}.json`;
        const userid = interaction.member.user.id;
        const game = interaction.options.getString('game');

        try {
            const file = JSON.parse(fs.readFileSync(jsonLocation, "utf-8"));
            delete file[`${userid}`][game];

            // 2b. Save file.
            fs.writeFileSync(jsonLocation, JSON.stringify(file));
            interaction.reply({content: 'Username was successfully removed.', ephemeral: true})
        }
        catch (err) {
            console.log(`ERROR: ${err}`);
            interaction.reply({content: 'No matching game found. Check your spelling.', ephemeral: true});
        }
    }
}