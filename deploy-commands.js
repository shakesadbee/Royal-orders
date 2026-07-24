const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
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

    console.log("Commands registered!");
  } catch (error) {
    console.error(error);
  }
})();
