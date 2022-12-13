const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const commands = [
    new SlashCommandBuilder()
    .setName('give')
    .setDescription('管理者権限を付与します'),

    new SlashCommandBuilder()
    .setName('remove')
    .setDescription('管理者権限を削除します'),

    new SlashCommandBuilder()
    .setName('addproject')
    .setDescription('企画会議に提案'),

    new SlashCommandBuilder()
    .setName('mute')
    .setDescription('vcメンバーをスピーカーミュートします'),

    new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('vcメンバーのスピーカーミュートを解除します'),

    new SlashCommandBuilder()
    .setName('mutecontrol')
    .setDescription('vcメンバーのスピーカーミュートをコントロールします'),

]
    .map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);