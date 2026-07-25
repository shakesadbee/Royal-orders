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
      option
        .setName("message")
        .setDescription("Message to send")
        .setRequired(true)
    )
    .toJSON()
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        "1530223484599533689",
        "1522931483587776552"
      ),
      { body: commands }
    );

    console.log("✅ Commands registered!");
  } catch (error) {
    console.error(error);
  }
})();
