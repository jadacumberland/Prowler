const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const client = require('../../client.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays information about Prowler\'s commands'),
    async execute(interaction) {
        const cmdArray = Array.from(await client.commands.keys());
        const embedArray = [];
        for (const cmd of cmdArray) {
            const command = client.commands.get(cmd);
            if (!(cmd === "update"))
                embedArray.push({name: cmd, value: command.data.description});
        }

        const embed = new EmbedBuilder()
            .setColor(0x691514)
            .setTitle(`Prowler Commands`)
            .addFields(embedArray);

        // 2. Print to user
        await interaction.reply({embeds: [embed]});
    }
}