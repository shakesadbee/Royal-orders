const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [

  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("order")
    .setDescription("Create a new order")
    .addUserOption(option =>
      option.setName("customer").setDescription("Select customer").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("service").setDescription("Service name").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("price").setDescription("Order price").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("details").setDescription("Order details").setRequired(true)
    )
    .addChannelOption(option =>
      option.setName("channel").setDescription("Channel where order will be sent").setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName("image").setDescription("Add order image").setRequired(false)
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

    console.log("✅ Commands registered successfully!");
  } catch (error) {
    console.error(error);
  }
})();
