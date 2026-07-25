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

  // ORDER COMMAND
  if (interaction.commandName === "order") {

    if (interaction.guild.ownerId !== interaction.user.id) {
      return interaction.reply({
        content: "❌ Only the server owner can use this command."
      });
    }

    const customer = interaction.options.getUser("customer");
    const service = interaction.options.getString("service");
    const price = interaction.options.getString("price");
    const details = interaction.options.getString("details");
    const channel = interaction.options.getChannel("channel");
    const image = interaction.options.getAttachment("image");

    let data = { lastOrderId: 0 };

    if (fs.existsSync("./orders.json")) {
      data = JSON.parse(fs.readFileSync("./orders.json", "utf8"));
    }

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
          value: service
        },
        {
          name: "📝 Details",
          value: details
        }
      )
      .setTimestamp();

    if (image) {
      embed.setImage(image.url);
    }

    await channel.send({
      embeds: [embed]
    });

    return interaction.reply({
      content: `✅ Order #${orderId} created.`
    });
  }

  // SAY COMMAND
  if (interaction.commandName === "say") {

    if (interaction.guild.ownerId !== interaction.user.id) {
      return interaction.reply({
        content: "❌ Only the server owner can use this command."
      });
    }

    const message = interaction.options.getString("message");

    await interaction.channel.send(message);

    return interaction.reply({
      content: "✅ Message sent."
    });
  }

  // VOUCH COMMAND
  if (interaction.commandName === "vouch") {

    const user = interaction.options.getUser("user");
    const message = interaction.options.getString("message");
    const channel = interaction.options.getChannel("channel");

    let vouchData = { lastVouchId: 0 };

    if (fs.existsSync("./vouches.json")) {
      vouchData = JSON.parse(
        fs.readFileSync("./vouches.json", "utf8")
      );
    }

    vouchData.lastVouchId++;

    fs.writeFileSync(
      "./vouches.json",
      JSON.stringify(vouchData, null, 2)
    );

    let counts = {};

    if (fs.existsSync("./vouchCounts.json")) {
      counts = JSON.parse(
        fs.readFileSync("./vouchCounts.json", "utf8")
      );
    }

    if (!counts[user.id]) {
      counts[user.id] = 0;
    }

    counts[user.id]++;

    fs.writeFileSync(
      "./vouchCounts.json",
      JSON.stringify(counts, null, 2)
    );

    const vouchId = String(vouchData.lastVouchId).padStart(4, "0");

    const embed = new EmbedBuilder()
      .setColor("#00ff99")
      .setTitle(`⭐ VOUCH #${vouchId}`)
      .addFields(
        {
          name: "👤 User",
          value: `${user}`
        },
        {
          name: "📝 Message",
          value: message
        },
        {
          name: "🌟 Given By",
          value: `${interaction.user}`
        },
        {
          name: "🏆 Total Vouches",
          value: `${counts[user.id]}`
        }
      )
      .setTimestamp();

    await channel.send({
      embeds: [embed]
    });

    return interaction.reply({
      content: `✅ Vouch #${vouchId} created.`
    });
  }

  // VOUCHCHECK COMMAND
  if (interaction.commandName === "vouchcheck") {

    const user = interaction.options.getUser("user");

    let counts = {};

    if (fs.existsSync("./vouchCounts.json")) {
      counts = JSON.parse(
        fs.readFileSync("./vouchCounts.json", "utf8")
      );
    }

    const total = counts[user.id] || 0;

    const embed = new EmbedBuilder()
      .setColor("#ffd700")
      .setTitle("⭐ Vouch Stats")
      .addFields(
        {
          name: "👤 User",
          value: `${user}`
        },
        {
          name: "🏆 Total Vouches",
          value: `${total}`
        }
      );

    return interaction.reply({
      embeds: [embed]
    });
  }
});

client.login(process.env.TOKEN);
