const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "order") {

    // Only server owner
    if (interaction.guild.ownerId !== interaction.user.id) {
      return interaction.reply({
        content: "❌ Only the server owner can use this command.",
        ephemeral: true
      });
    }

    const customer = interaction.options.getUser("customer");
    const service = interaction.options.getString("service");
    const price = interaction.options.getString("price");
    const details = interaction.options.getString("details");
    const channel = interaction.options.getChannel("channel");
    const image = interaction.options.getAttachment("image");

    // Load order counter
    const data = JSON.parse(
      fs.readFileSync("./orders.json", "utf8")
    );

    data.lastOrderId++;

    fs.writeFileSync(
      "./orders.json",
      JSON.stringify(data, null, 2)
    );

    const orderId = String(data.lastOrderId).padStart(4, "0");

    const embed = new EmbedBuilder()
      .setColor("#8b5cf6")
      .setTitle(`👑 ORDER #${orderId}`)
      .addFields(
        {
          name: "👤 Customer",
          value: `${customer}`,
          inline: true
        },
        {
          name: "💰 Price",
          value: price,
          inline: true
        },
        {
          name: "📦 Service",
          value: service,
          inline: false
        },
        {
          name: "📝 Details",
          value: details,
          inline: false
        }
      )
      .setTimestamp();

    if (image) {
      embed.setImage(image.url);
    }

    await channel.send({
      embeds: [embed]
    });

    await interaction.reply({
      content: `✅ Order #${orderId} created.`,
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);
