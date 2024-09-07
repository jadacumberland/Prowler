const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearprofile')
        .setDescription('Removes all usernames from your profile'),
    async execute(interaction) {
        // 1. Get username/game/id from user
        const jsonLocation = `jsons/${interaction.guild.id}.json`;
        const userid = interaction.member.user.id;

        try {
            const file = JSON.parse(fs.readFileSync(jsonLocation, "utf-8"));
            delete file[`${userid}`];

            // 2b. Save file.
            fs.writeFileSync(jsonLocation, JSON.stringify(file));
            interaction.reply({content: 'All usernames were successfully removed.', ephemeral: true})
        }
        catch (err) {
            console.log(`ERROR: ${err}`);
            interaction.reply({content: 'No matching user found.', ephemeral: true});
        }
    }
}