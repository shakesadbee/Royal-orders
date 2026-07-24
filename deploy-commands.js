const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("order")
    .setDescription("Create a new order")
    .addUserOption(option =>
      option
        .setName("customer")
        .setDescription("Customer of the order")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("service")
        .setDescription("Service name")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("price")
        .setDescription("Order price")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("details")
        .setDescription("Order details")
        .setRequired(true)
    )
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Channel to send order")
        .setRequired(true)
    )
    .addAttachmentOption(option =>
      option
        .setName("image")
        .setDescription("Order image")
        .setRequired(false)
    )
    .toJSON()
];
