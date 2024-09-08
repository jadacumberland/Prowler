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
            const array = file[`${userid}`][delGame];

            // Delete user game id
            for (const index in array) {
                if (array[index] === delName) {
                    array.splice(index, 1);
                    break;
                }
                if (index == array.length - 1) {
                    throw new Error("Username not found.");
                }
            }
            delete file[`${userid}`][delGame][delName];

            if (array === undefined || array.length === 0) {
                // array does not exist or is empty
                delete file [`${userid}`][delGame];
            }

            // 2b. Save file.
            fs.writeFileSync(jsonLocation, JSON.stringify(file));
            console.log(`[INFO] Username was successfully removed.`);
            interaction.reply({content: 'Username was successfully removed.', ephemeral: true})
        }
        catch (err) {
            console.log(`[ERROR] ${err}`);
            interaction.reply({content: 'No matching game or username found. Check your spelling.', ephemeral: true});
        }
    }
}