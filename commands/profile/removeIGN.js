const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeid')
        .setDescription('Removes username from your profile')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('Game to remove username for')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username to be removed')
                .setRequired(true)),
    async execute(interaction) {
        // 1. Get username/game/id from user
        const jsonLocation = `jsons/${interaction.guild.id}.json`;
        const userid = interaction.member.user.id;
        const delGame = interaction.options.getString('game');
        const delName = interaction.options.getString('username');

        try {
            const file = JSON.parse(fs.readFileSync(jsonLocation, "utf-8"));
            // Delete user game id
            delete file[`${userid}`][delGame][delName];

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