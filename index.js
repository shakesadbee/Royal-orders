const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});


// ================= FILE SYSTEM =================

function loadFile(file, defaultData){

  if(!fs.existsSync(file)){

    fs.writeFileSync(
      file,
      JSON.stringify(defaultData,null,2)
    );

    return defaultData;

  }

  return JSON.parse(
    fs.readFileSync(file,"utf8")
  );

}


function saveFile(file,data){

  fs.writeFileSync(
    file,
    JSON.stringify(data,null,2)
  );

}


// ================= TIME CONVERTER =================

function convertTime(time){

  const match =
  time.match(/^(\d+)(m|h|d)$/);

  if(!match)
    return null;


  const num =
  Number(match[1]);


  if(match[2] === "m")
    return num * 60000;


  if(match[2] === "h")
    return num * 3600000;


  if(match[2] === "d")
    return num * 86400000;

}


// ================= STATUS SYSTEM =================

function getStatus(){

  return loadFile(
    "./status.json",
    {
      channelId:"",
      messageId:"",
      status:"offline",
      setups:0
    }
  );

}


function saveStatus(data){

  saveFile(
    "./status.json",
    data
  );

}


async function updateStatus(client){

  const data =
  getStatus();


  if(!data.channelId || !data.messageId)
    return;


  const channel =
  await client.channels.fetch(
    data.channelId
  ).catch(()=>null);


  if(!channel)
    return;


  const msg =
  await channel.messages.fetch(
    data.messageId
  ).catch(()=>null);


  if(!msg)
    return;


  let emoji = "⚫";

  let status = "Offline";


  if(data.status === "available"){

    emoji = "🟢";
    status = "Available";

  }


  if(data.status === "busy"){

    emoji = "🔴";
    status = "Busy";

  }


  const embed =
  new EmbedBuilder()

  .setColor("#8b5cf6")

  .setTitle("📡 Roblox AFK Center")

  .addFields(

    {
      name:"Status",
      value:`${emoji} ${status}`
    },

    {
      name:"🎮 Available Setups",
      value:`${data.setups}`
    }

  )

  .setTimestamp();


  await msg.edit({
    embeds:[embed]
  });


}
// ================= BOT READY =================

client.once(Events.ClientReady, async () => {

  console.log(`Logged in as ${client.user.tag}`);

  await updateStatus(client);

});


// ================= INTERACTIONS =================

client.on(
  Events.InteractionCreate,
  async interaction => {


    if(
      !interaction.isChatInputCommand() &&
      !interaction.isButton()
    ) return;



// ================= SAY =================

if(interaction.commandName === "say"){


  if(!interaction.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  )){

    return interaction.reply({
      content:"❌ You need Administrator permission.",
      ephemeral:true
    });

  }


  const message =
  interaction.options.getString("message");


  await interaction.channel.send(message);


  return interaction.reply({
    content:"✅ Message sent.",
    ephemeral:true
  });


}



// ================= ORDER =================

if(interaction.commandName === "order"){


  if(!interaction.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  )){

    return interaction.reply({
      content:"❌ You need Administrator permission.",
      ephemeral:true
    });

  }


  const customer =
  interaction.options.getUser("customer");


  const service =
  interaction.options.getString("service");


  const price =
  interaction.options.getString("price");


  const details =
  interaction.options.getString("details");


  const channel =
  interaction.options.getChannel("channel");


  const image =
  interaction.options.getAttachment("image");



  let data =
  loadFile(
    "./orders.json",
    {
      lastOrderId:0
    }
  );


  data.lastOrderId++;


  saveFile(
    "./orders.json",
    data
  );


  const id =
  String(data.lastOrderId)
  .padStart(4,"0");



  const embed =
  new EmbedBuilder()

  .setColor("#8b5cf6")

  .setTitle(`👑 ORDER #${id}`)

  .addFields(

    {
      name:"👤 Customer",
      value:`${customer}`
    },

    {
      name:"📦 Service",
      value:service
    },

    {
      name:"💰 Price",
      value:price
    },

    {
      name:"📝 Details",
      value:details
    }

  )

  .setTimestamp();



  if(image)
    embed.setImage(image.url);



  await channel.send({
    embeds:[embed]
  });


  return interaction.reply({
    content:`✅ Order #${id} created.`,
    ephemeral:true
  });


}
    // ================= VOUCH =================

if(interaction.commandName === "vouch"){


  const user =
  interaction.options.getUser("user");


  const message =
  interaction.options.getString("message");


  const channel =
  interaction.options.getChannel("channel");



  let data =
  loadFile(
    "./vouches.json",
    {
      lastVouchId:0
    }
  );


  let counts =
  loadFile(
    "./vouchCounts.json",
    {}
  );


  data.lastVouchId++;


  if(!counts[user.id])
    counts[user.id] = 0;


  counts[user.id]++;


  saveFile(
    "./vouches.json",
    data
  );


  saveFile(
    "./vouchCounts.json",
    counts
  );


  const id =
  String(data.lastVouchId)
  .padStart(4,"0");



  const embed =
  new EmbedBuilder()

  .setColor("#00ff99")

  .setTitle(`⭐ VOUCH #${id}`)

  .addFields(

    {
      name:"👤 User",
      value:`${user}`
    },

    {
      name:"📝 Message",
      value:message
    },

    {
      name:"🌟 Given By",
      value:`${interaction.user}`
    },

    {
      name:"🏆 Total Vouches",
      value:`${counts[user.id]}`
    }

  )

  .setTimestamp();



  await channel.send({
    embeds:[embed]
  });



  return interaction.reply({
    content:`✅ Vouch #${id} created.`,
    ephemeral:true
  });


}



// ================= VOUCH CHECK =================

if(interaction.commandName === "vouchcheck"){


  const user =
  interaction.options.getUser("user");


  let counts =
  loadFile(
    "./vouchCounts.json",
    {}
  );


  const total =
  counts[user.id] || 0;



  const embed =
  new EmbedBuilder()

  .setColor("#ffd700")

  .setTitle("⭐ Vouch Stats")

  .addFields(

    {
      name:"👤 User",
      value:`${user}`
    },

    {
      name:"🏆 Total Vouches",
      value:`${total}`
    }

  );



  return interaction.reply({
    embeds:[embed]
  });


}
    // ================= STATUS CHANNEL =================

if(interaction.commandName === "setstatuschannel"){


  if(!interaction.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  )){

    return interaction.reply({
      content:"❌ You need Administrator permission.",
      ephemeral:true
    });

  }


  const channel =
  interaction.options.getChannel("channel");


  const data =
  getStatus();


  data.channelId =
  channel.id;


  saveStatus(data);


  return interaction.reply({
    content:`✅ Status channel set to ${channel}`,
    ephemeral:true
  });


}



// ================= CREATE STATUS =================

if(interaction.commandName === "createstatus"){


  if(!interaction.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  )){

    return interaction.reply({
      content:"❌ You need Administrator permission.",
      ephemeral:true
    });

  }


  const data =
  getStatus();


  if(!data.channelId){

    return interaction.reply({
      content:"❌ Set a status channel first.",
      ephemeral:true
    });

  }


  const channel =
  await client.channels.fetch(
    data.channelId
  );


  const embed =
  new EmbedBuilder()

  .setColor("#8b5cf6")

  .setTitle("📡 Roblox AFK Center")

  .addFields(

    {
      name:"Status",
      value:"⚫ Offline"
    },

    {
      name:"🎮 Available Setups",
      value:"0"
    }

  )

  .setTimestamp();


  const msg =
  await channel.send({
    embeds:[embed]
  });


  data.messageId =
  msg.id;


  saveStatus(data);


  return interaction.reply({
    content:"✅ Status message created.",
    ephemeral:true
  });


}



// ================= STATUS =================

if(interaction.commandName === "status"){


  if(!interaction.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  )){

    return interaction.reply({
      content:"❌ You need Administrator permission.",
      ephemeral:true
    });

  }


  const state =
  interaction.options.getString("state");


  const data =
  getStatus();


  data.status =
  state;


  saveStatus(data);


  await updateStatus(client);


  return interaction.reply({
    content:`✅ Status updated to ${state}`,
    ephemeral:true
  });


}



// ================= SETUPS =================

if(interaction.commandName === "setups"){


  if(!interaction.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  )){

    return interaction.reply({
      content:"❌ You need Administrator permission.",
      ephemeral:true
    });

  }


  const amount =
  interaction.options.getInteger("amount");


  const data =
  getStatus();


  data.setups =
  amount;


  saveStatus(data);


  await updateStatus(client);


  return interaction.reply({
    content:`✅ Available setups updated to ${amount}`,
    ephemeral:true
  });


}
    // ================= GIVEAWAY CREATE =================

if(interaction.commandName === "giveaway"){

  if(!interaction.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  )){

    return interaction.reply({
      content:"❌ You need Administrator permission.",
      ephemeral:true
    });

  }

  const prize =
  interaction.options.getString("prize");

  const duration =
  interaction.options.getString("duration");

  const winners =
  interaction.options.getInteger("winners");

  const channel =
  interaction.options.getChannel("channel");

  const time =
  convertTime(duration);

  if(!time){

    return interaction.reply({
      content:"❌ Use format: 1m, 1h, 1d",
      ephemeral:true
    });

  }

  let data =
  loadFile(
    "./giveaways.json",
    {
      lastGiveawayId:0,
      giveaways:{}
    }
  );

  data.lastGiveawayId++;

  const id =
  String(data.lastGiveawayId)
  .padStart(4,"0");

  data.giveaways[id] = {

    prize:prize,
    winners:winners,
    users:[],
    channel:channel.id,
    endTime:Date.now()+time

  };

  saveFile(
    "./giveaways.json",
    data
  );

  const button =
  new ButtonBuilder()

  .setCustomId(`giveaway_${id}`)

  .setLabel("🎉 Join Giveaway")

  .setStyle(ButtonStyle.Success);

  const row =
  new ActionRowBuilder()
  .addComponents(button);

  const embed =
  new EmbedBuilder()

  .setColor("#ff00ff")

  .setTitle(`🎉 GIVEAWAY #${id}`)

  .addFields(

    {
      name:"🎁 Prize",
      value:prize
    },

    {
      name:"🏆 Winners",
      value:`${winners}`
    },

    {
      name:"👥 Participants",
      value:"0"
    },

    {
      name:"⏰ Duration",
      value:duration
    }

  )

  .setTimestamp();

  await channel.send({
    embeds:[embed],
    components:[row]
  });

  return interaction.reply({
    content:`✅ Giveaway #${id} started.`,
    ephemeral:true
  });

}



// ================= GIVEAWAY BUTTON =================

if(interaction.isButton()){

  if(
    !interaction.customId.startsWith(
      "giveaway_"
    )
  ) return;

  const id =
  interaction.customId.replace(
    "giveaway_",
    ""
  );

  let data =
  loadFile(
    "./giveaways.json",
    {
      lastGiveawayId:0,
      giveaways:{}
    }
  );

  const giveaway =
  data.giveaways[id];

  if(!giveaway){

    return interaction.reply({
      content:"❌ Giveaway ended.",
      ephemeral:true
    });

  }

  if(
    giveaway.users.includes(
      interaction.user.id
    )
  ){

    return interaction.reply({
      content:"❌ You already joined.",
      ephemeral:true
    });

  }

  giveaway.users.push(
    interaction.user.id
  );

  saveFile(
    "./giveaways.json",
    data
  );

  const embed =
  EmbedBuilder.from(
    interaction.message.embeds[0]
  );

  embed.spliceFields(
    2,
    1,
    {
      name:"👥 Participants",
      value:`${giveaway.users.length}`
    }
  );

  await interaction.message.edit({
    embeds:[embed]
  });

  return interaction.reply({
    content:"🎉 You joined the giveaway!",
    ephemeral:true
  });

}



// ================= REROLL =================

if(interaction.commandName === "reroll"){

  if(!interaction.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  )){

    return interaction.reply({
      content:"❌ You need Administrator permission.",
      ephemeral:true
    });

  }

  const id =
  interaction.options.getString("id");

  const data =
  loadFile(
    "./giveaways.json",
    {
      lastGiveawayId:0,
      giveaways:{}
    }
  );

  const giveaway =
  data.giveaways[id];

  if(!giveaway){

    return interaction.reply({
      content:"❌ Giveaway not found.",
      ephemeral:true
    });

  }

  if(giveaway.users.length === 0){

    return interaction.reply({
      content:"❌ No participants.",
      ephemeral:true
    });

  }

  const winner =
  giveaway.users[
    Math.floor(
      Math.random() *
      giveaway.users.length
    )
  ];

  return interaction.reply({
    content:`🏆 New winner: <@${winner}>`
  });

}

});



// ================= GIVEAWAY AUTO END =================

setInterval(async () => {

  const data =
  loadFile(
    "./giveaways.json",
    {
      lastGiveawayId:0,
      giveaways:{}
    }
  );

  let changed = false;

  for(const id in data.giveaways){

    const giveaway =
    data.giveaways[id];

    if(Date.now() >= giveaway.endTime){

      const channel =
      await client.channels.fetch(
        giveaway.channel
      ).catch(()=>null);

      if(channel){

        if(giveaway.users.length === 0){

          await channel.send(
            `❌ Giveaway #${id} ended. No participants.`
          );

        } else {

          const users =
          [...giveaway.users];

          const winners = [];

          while(
            winners.length < giveaway.winners &&
            users.length > 0
          ){

            const random =
            Math.floor(
              Math.random()*users.length
            );

            winners.push(
              users[random]
            );

            users.splice(
              random,
              1
            );

          }

          const embed =
          new EmbedBuilder()

          .setColor("#00ff00")

          .setTitle("🎉 Giveaway Ended!")

          .addFields(

            {
              name:"🎁 Prize",
              value:giveaway.prize
            },

            {
              name:"🏆 Winners",
              value:winners.map(
                x=>`<@${x}>`
              ).join("\n")
            }

          )

          .setTimestamp();

          await channel.send({
            embeds:[embed]
          });

        }

      }

      delete data.giveaways[id];
      changed = true;

    }

  }

  if(changed){

    saveFile(
      "./giveaways.json",
      data
    );

  }

},5000);



client.login(process.env.TOKEN);
