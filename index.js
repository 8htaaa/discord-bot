const { Client ,GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder,} = require('discord.js')

const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
        // ...
    ]
})

const { token } = require('./config.json');
client.on('ready', () => {
  console.log(`${client.user.tag}がサーバーにログインしました！`);
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'mute') {
    try{
      const channelId = interaction.member.voice.channelId
      interaction.client.channels.cache.find(c => c.id === channelId).members.every(u => u.voice.setMute())
      const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('vcメンバーをミュートしました')
            .setDescription('/mute');
      interaction.reply({embeds: [embed]});
    }
    catch{
      const embed = new EmbedBuilder()
          .setColor('Red')
          .setTitle('エラーが発生しました')
          .setDescription('もしかして君vc入ってないんじゃない？');
      interaction.reply({embeds: [embed], ephemeral: true});
    }
  }

  if (interaction.commandName === 'unmute') {
    try{
      const channelId = interaction.member.voice.channelId
      interaction.client.channels.cache.find(c => c.id === channelId).members.every(u => u.voice.setMute(false))
      const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('vcメンバーのミュートを解除しました')
            .setDescription('/unmute');
      interaction.reply({embeds: [embed]});
    }
    catch{
      const embed = new EmbedBuilder()
          .setColor('Red')
          .setTitle('エラーが発生しました')
          .setDescription('もしかして君vc入ってないんじゃない？');
      interaction.reply({embeds: [embed], ephemeral: true});
    }
  }
  
  if (interaction.commandName === 'mutecontrol') {
    const mute = new ActionRowBuilder()
			  .addComponents(
				  new ButtonBuilder()
					  .setCustomId('muteb')
					  .setLabel('🔇ミュート')
					  .setStyle(ButtonStyle.Secondary),
                );
    const unmute = new ActionRowBuilder()
         .addComponents(
            new ButtonBuilder()
             .setCustomId('unmuteb')
              .setLabel('🔈ミュート解除')
              .setStyle(ButtonStyle.Secondary),
                );
      const embed = new EmbedBuilder()
          .setColor('Purple')
          .setTitle('ミュートコントロール')
      await interaction.reply({embeds: [embed], components: [mute,unmute]});
  }

  if (interaction.commandName === 'give') {
    const member = interaction.member;
    if (member.roles.cache.has('827030246364676096')){
      const row = new ActionRowBuilder()
			  .addComponents(
				  new ButtonBuilder()
					  .setCustomId('remove')
					  .setLabel('管理者権限を削除')
					  .setStyle(ButtonStyle.Primary),
              );
      const embed = new EmbedBuilder()
          .setColor('Red')
         .setTitle('あれ？君もう管理者権限持ってない？')
      await interaction.reply({embeds: [embed], components: [row] , ephemeral: true });
      }
    else {
      await member.roles.add("827030246364676096");
      const row = new ActionRowBuilder()
			  .addComponents(
				  new ButtonBuilder()
					  .setCustomId('remove')
					  .setLabel('管理者権限を削除')
					  .setStyle(ButtonStyle.Primary),
              );
      const embed = new EmbedBuilder()
          .setColor('Green')
         .setTitle('管理者権限を付与しました！！')
         .setDescription('/give');
      await interaction.reply({embeds: [embed], components: [row] , ephemeral: true });
      }
  }


  if (interaction.commandName === 'remove') {
    const member = interaction.member;
    if (member.roles.cache.has('827030246364676096')){
      await member.roles.remove("827030246364676096");
      const embed = new EmbedBuilder()
     .setColor('Yellow')
     .setTitle('管理者権限を削除しました！！')
     .setDescription('/remove');
    await interaction.reply({embeds: [embed], ephemeral: true });
    }
  else {
      const embed = new EmbedBuilder()
         .setColor('Red')
         .setTitle('あれ？君管理者権限持ってないよ？')
      await interaction.reply({embeds: [embed], ephemeral: true });
    }

  }


  if (interaction.commandName === 'addproject') {
    const modal = new ModalBuilder()
			.setCustomId('addproject')
			.setTitle('企画を提案');
            const name = new TextInputBuilder()
			.setCustomId('name')
		    // The label is the prompt the user sees for this input
			.setLabel("企画名")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const description = new TextInputBuilder()
			.setCustomId('description')
			.setLabel("企画の内容")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(name);
		const secondActionRow = new ActionRowBuilder().addComponents(description);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
  }

});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    const name = interaction.fields.getTextInputValue('name');
    const description = interaction.fields.getTextInputValue('description');
    const good = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('good')
					.setLabel('👍いいね！')
					.setStyle(ButtonStyle.Secondary),
            );
    const bad = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('bad')
					.setLabel('👎うーん。')
					.setStyle(ButtonStyle.Secondary),
            );
          const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(name)
            .setDescription(description)
            
    await interaction.reply({content: 'リアクション：', embeds: [embed], components: [good,bad]} );
  });

  
client.on('interactionCreate', async (interaction,message) => {
    if (interaction.customId === "remove") {
        const member = interaction.member;
        await member.roles.remove("827030246364676096");
        const embed = new EmbedBuilder()
          .setColor('Red')
          .setTitle('管理者権限を削除しました！！')
          .setDescription('/remove');
    await interaction.reply({embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === "muteb") {
      try{
        const channelId = interaction.member.voice.channelId
        interaction.client.channels.cache.find(c => c.id === channelId).members.every(u => u.voice.setMute())
        const embed = new EmbedBuilder() 
          .setColor('Red')
          .setTitle('ミュートコントロール')
          .setDescription('ミュート中');
        interaction.update({embeds: [embed]});
      }
    catch{
      const embed = new EmbedBuilder()
          .setColor('Red')
          .setTitle('エラーが発生しました')
          .setDescription('もしかして君vc入ってないんじゃない？');
      interaction.reply({embeds: [embed], ephemeral: true});
    }
  }

    if (interaction.customId === "unmuteb") {
      try{
        const channelId = interaction.member.voice.channelId
        interaction.client.channels.cache.find(c => c.id === channelId).members.every(u => u.voice.setMute(false))
        const embed = new EmbedBuilder()
          .setThumbnail("attachment://microphone.png")
          .setColor('Blue')
          .setTitle('ミュートコントロール')
          .setDescription('ミュート解除');
        interaction.update({embeds: [embed]});
      }
      catch{
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('エラーが発生しました')
            .setDescription('もしかして君vc入ってないんじゃない？');
        interaction.reply({embeds: [embed], ephemeral: true});
      }
  }


    if (interaction.customId === "good") {
      const message = interaction.message
      interaction.update(message.content + '👍')
      var cm = ( message.content.match( /👍/g ) || [] ).length
      if (cm +1 == 4){
        const embed = new EmbedBuilder()
          .setColor('blue')
          .setTitle('多数のメンバーがこの企画に賛同しました')
          .setDescription('メッセージをピン止めしました');
        message.reply({embeds: [embed]})
        message.pin()
      }
    }

    if (interaction.customId === "bad") {
        const message = interaction.message
        interaction.update(message.content + '👎')
    }
   });


   client.on('messageCreate', async message => {
    if(message.author.bot) return;

    if(message.content === '(  ･ᴗ･ )⚐⚑⚐゛'){
      message.channel.send('(  ･ᴗ･ )⚐⚑⚐゛');
    }
    
    if (message.content.match(/😀|にっこりわらう/)) {
      let react = '😀';
      message.react(react)
        .then(message => console.log("リアクション: 😀"))
        .catch(console.error);
    }
    if (message.content.match(/🥗/)) {
      let react = '🥗';
      message.react(react)
        .then(message => console.log("リアクション: 🥗"))
        .catch(console.error);
    }
  
    if (message.content.match(/👍/)) {
      let react = '👍';
      message.react(react)
        .then(message => console.log("リアクション: 👍"))
        .catch(console.error);
    }
  
    if (message.content.match(/はるき/)) {
      let react = '🍉';
      message.react(react)
        .then(message => console.log("リアクション: 🍉"))
        .catch(console.error);
    }
    
    if (message.content.match(/まっさー/)) {
      let react = '🌰';
      message.react(react)
        .then(message => console.log("リアクション: 🌰"))
        .catch(console.error);
    }
  
    if (message.content.match(/はた/)) {
      let react = '🚩';
      message.react(react)
        .then(message => console.log("リアクション: 🚩"))
        .catch(console.error);
    }
    
    if (message.content.match(/みか/)) {
      let react = '👓';
      message.react(react)
        .then(message => console.log("リアクション: 👓"))
        .catch(console.error);
    }
})




client.login(token);