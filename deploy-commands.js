const {REST, Routes} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv').config();

const commands = [];

// Get TOKEN
const TOKEN = process.env.DISCORD_TOKEN || "";
if (TOKEN.toString().trim() === "") {
    throw new Error("Invalid Discord access token configured.");
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(TOKEN);

// Get Client ID
const CLIENT_ID = process.env.CLIENT_ID || "";
if (CLIENT_ID.toString().trim() === "") {
    throw new Error("Invalid Discord client ID configured.");
}

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set new collection item with key as command name
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing "data" or "execute" property.`)
        }
    }
}
// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log(commands);

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();