const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {spawn} = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Pulls from the server and updates the bot. Admins only.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (interaction.member.user.id !== "176106602833772544")
            return interaction.reply("YOU DO NOT HAVE PERMISSION FOR THIS COMMAND.");
        const child = await spawn('bash', ['./update.sh']);

        await interaction.reply({content: 'The bot repository has been updated.', ephemeral: true });
    },
};