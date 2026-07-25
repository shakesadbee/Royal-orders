const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [

  new SlashCommandBuilder()
    .setName("order")
    .setDescription("Create a new order")
    .addUserOption(option =>
      option.setName("customer").setDescription("Customer").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("service").setDescription("Service").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("price").setDescription("Price").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("details").setDescription("Details").setRequired(true)
    )
    .addChannelOption(option =>
      option.setName("channel").setDescription("Channel").setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName("image").setDescription("Image").setRequired(false)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something")
    .addStringOption(option =>
      option.setName("message").setDescription("Message to send").setRequired(true)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("vouch")
    .setDescription("Give a vouch to a user")
    .addUserOption(option =>
      option.setName("user").setDescription("User to vouch").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("message").setDescription("Vouch message").setRequired(true)
    )
    .addChannelOption(option =>
      option.setName("channel").setDescription("Channel to send the vouch").setRequired(true)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("vouchcheck")
    .setDescription("Check a user's vouches")
    .addUserOption(option =>
      option.setName("user").setDescription("User to check").setRequired(true)
    )
    .toJSON()

];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering GLOBAL commands...");

    await rest.put(
      Routes.applicationCommands(
        "1530223484599533689"
      ),
      { body: commands }
    );

    console.log("✅ Global commands registered!");
  } catch (error) {
    console.error(error);
  }
})();
