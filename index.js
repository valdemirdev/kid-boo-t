// Anti-crash / logs úteis
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require('discord.js');

// Healthcheck HTTP (Render gosta disso)
const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Kid Boo-T online');
}).listen(PORT, () => {
  console.log(`🌐 Healthcheck rodando na porta ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.once(Events.ClientReady, () => {
  console.log(`🤖 Kid Boo-T online como ${client.user.tag}`);
});

// Quando clicar nos botões
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  const member = interaction.member;

  const classes = {
    paladino: '🛡️.',
    mago: '🧙‍♂️.',
    arqueiro: '🏹.',
    clerigo: '🔮.'
  };

  const emoji = classes[interaction.customId];
  if (!emoji) return;

  const nomeOriginal = member.user.username;
  const novoNick = `${emoji}${nomeOriginal}`;

  try {
    await member.setNickname(novoNick);
    await interaction.reply({
      content: `✅ Seu nick foi atualizado para **${novoNick}**`,
      ephemeral: true
    });
  } catch (err) {
    await interaction.reply({
      content: '❌ Não consegui mudar seu nick. Verifique minhas permissões.',
      ephemeral: true
    });
  }
});

// Comando para enviar a mensagem com botões
client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;
  if (message.content !== '!classes') return;

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('paladino')
      .setLabel('Paladino')
      .setEmoji('🛡️')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('mago')
      .setLabel('Mago')
      .setEmoji('🧙‍♂️')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('arqueiro')
      .setLabel('Arqueiro')
      .setEmoji('🏹')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('clerigo')
      .setLabel('Clérigo')
      .setEmoji('🔮')
      .setStyle(ButtonStyle.Primary)
  );

  await message.channel.send({
    content: '**⚔️ ESCOLHA SUA CLASSE ⚔️**\nClique em um botão para adicionar o emoji ao seu nickname:',
    components: [row]
  });
});

client.login(process.env.DISCORD_TOKEN);
