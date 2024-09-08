const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addid')
        .setDescription('Adds or changes username in your profile')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('Game to add username for')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username on the specified game')
                .setRequired(true)),
    async execute(interaction) {
        // 1. Get username/game/id from user
        const jsonLocation = `jsons/${interaction.guild.id}.json`;
        try {
            fs.readFileSync(jsonLocation, "utf-8");
        }
        catch (err) {
            console.log(`ERROR: ${err}`)
            await fs.writeFileSync(jsonLocation, "{}")
        }
        const userid = interaction.member.user.id;
        const game = interaction.options.getString('game');
        const username = interaction.options.getString('username');

        // 2. Add to JSON file
        // 2a. Lookup entry by id. Create new if none exists.
        const file = JSON.parse(fs.readFileSync(jsonLocation, "utf-8"));
        if (file[`${userid}`] === undefined) {
            file[`${userid}`] = {};
        }

        if (file[`${userid}`][game] === undefined) {
            file[`${userid}`][game] = [];
        }

        // Add username to file
        let thisProfileGame = file[`${userid}`][game];
        thisProfileGame.push(username);

        // 2b. Save file.
        fs.writeFileSync(jsonLocation, JSON.stringify(file));

        // 3. Reply to interaction
        interaction.reply({content: "Username was successfully added.", ephemeral: true});
    }
}