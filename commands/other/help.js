const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays information about Prowler\'s commands'),
    async execute(interaction) {
        interaction.reply({content: ['Hello.']});
    }
}