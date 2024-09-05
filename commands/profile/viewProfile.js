const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewprofile')
        .setDescription('Shows the users stored usernames')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User whose profile you would like to see')),
    async execute(interaction) {
        // 1. Collect info from file using userid as a key
        let user = null;
        try {
            user = interaction.options.getUser('user').id;
        }
        catch (err) {
            user = interaction.member.user;
        }

        const userid = user.id;
        const username = user.globalName;
        const userAvatar = user.displayAvatarURL();

        const file = JSON.parse(fs.readFileSync(`jsons/${interaction.guild.id}.json`, "utf-8"));
        const thisProfile = file[`${userid}`];

        const array =[];
        for(const field in thisProfile) {
            array.push({name: field, value: thisProfile[field]})
        }

        const embed = new EmbedBuilder()
            .setColor(interaction.member.displayHexColor)
            .setTitle(`${username}'s Profile`)
            .setThumbnail(userAvatar)
            .addFields(array);

        // 2. Print to user
        await interaction.reply({embeds: [embed]});
    }
}