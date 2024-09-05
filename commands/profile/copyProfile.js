const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copyprofile')
        .setDescription('Copies user profile from another server')
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('Server to copy profile from')
                .setRequired(true)),
    async execute(interaction) {
        // 1. Get old JSON location
        const oldLocation = `jsons/${interaction.options.getString('serverid')}.json`;
        const newLocation = `jsons/${interaction.guild.id}.json`;

        const userid = interaction.member.user.id;
        let oldFile = null;

        // 2. Attempt to open from server's file. If file does not exist, return error. If user profile is empty, return error.
        try {
            oldFile = JSON.parse(fs.readFileSync(oldLocation, "utf-8"));
            if (oldFile[`${userid}`] === undefined)
                reportError(new ReferenceError("User profile does not exist."));
        }
        catch (err) {
            console.log(`ERROR: ${err}`);
            return(interaction.reply('Server profile does not exist.'));
        }

        // 3. Attempt to open this server's file. If file does not exist, create it.
        try {
            fs.readFileSync(newLocation, "utf-8");
        }
        catch (err) {
            console.log(`ERROR: ${err}`);
            await fs.writeFileSync(newLocation, "{}");
        }

        // 4. Transfer profile from old server to this server.
        const newFile = JSON.parse(fs.readFileSync(newLocation, "utf-8"));
        newFile[`${userid}`] = oldFile[`${userid}`];

        // 5. Save this server's file.
        fs.writeFileSync(newLocation, JSON.stringify(newFile));

        // 6. Reply to interaction.
        interaction.reply({content: "Profile was successfully copied.", ephemeral: true})
    }
}