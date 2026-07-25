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


function parseDuration(time) {
  const match = time.match(/^(\d+)(m|h|d)$/);

  if (!match) return null;

  const amount = Number(match[1]);

  if (time.endsWith("m")) {
    return amount * 60 * 1000;
  }

  if (time.endsWith("h")) {
    return amount * 60 * 60 * 1000;
  }

  if (time.endsWith("d")) {
    return amount * 24 * 60 * 60 * 1000;
  }
}


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});


client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});


client.on(Events.InteractionCreate, async interaction => {


if (!interaction.isChatInputCommand() && !interaction.isButton()) return;



// ================= ORDER =================

if (interaction.commandName === "order") {


if (!interaction.member.permissions.has(
  PermissionsBitField.Flags.Administrator
)) {
  return interaction.reply({
    content:"❌ You need Administrator permission."
  });
}


const customer = interaction.options.getUser("customer");
const service = interaction.options.getString("service");
const price = interaction.options.getString("price");
const details = interaction.options.getString("details");
const channel = interaction.options.getChannel("channel");
const image = interaction.options.getAttachment("image");


let data = {lastOrderId:0};


if(fs.existsSync("./orders.json")) {
 data = JSON.parse(
  fs.readFileSync("./orders.json","utf8")
 );
}


data.lastOrderId++;


fs.writeFileSync(
 "./orders.json",
 JSON.stringify(data,null,2)
);


const orderId = String(data.lastOrderId).padStart(4,"0");


const embed = new EmbedBuilder()
.setColor("#8b5cf6")
.setTitle(`👑 ORDER #${orderId}`)
.addFields(
{
 name:"👤 Customer",
 value:`${customer}`
},
{
 name:"💰 Price",
 value:price
},
{
 name:"📦 Service",
 value:service
},
{
 name:"📝 Details",
 value:details
}
)
.setTimestamp();


if(image){
 embed.setImage(image.url);
}


await channel.send({
 embeds:[embed]
});


return interaction.reply({
 content:`✅ Order #${orderId} created.`
});


}



// ================= SAY =================


if(interaction.commandName === "say") {


if(!interaction.member.permissions.has(
 PermissionsBitField.Flags.Administrator
)) {
 return interaction.reply({
  content:"❌ You need Administrator permission."
 });
}


const message =
interaction.options.getString("message");


await interaction.channel.send(message);


return interaction.reply({
 content:"✅ Message sent."
});


}
  // ================= VOUCH =================

if (interaction.commandName === "vouch") {


const user = interaction.options.getUser("user");
const message = interaction.options.getString("message");
const channel = interaction.options.getChannel("channel");


let vouchData = {
 lastVouchId:0
};


if(fs.existsSync("./vouches.json")) {

vouchData = JSON.parse(
 fs.readFileSync("./vouches.json","utf8")
);

}


vouchData.lastVouchId++;


fs.writeFileSync(
 "./vouches.json",
 JSON.stringify(vouchData,null,2)
);



let counts = {};


if(fs.existsSync("./vouchCounts.json")) {

counts = JSON.parse(
 fs.readFileSync("./vouchCounts.json","utf8")
);

}



if(!counts[user.id]) {
 counts[user.id] = 0;
}


counts[user.id]++;


fs.writeFileSync(
 "./vouchCounts.json",
 JSON.stringify(counts,null,2)
);



const id = String(vouchData.lastVouchId)
.padStart(4,"0");



const embed = new EmbedBuilder()

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
 content:`✅ Vouch #${id} created.`
});


}



// ================= VOUCH CHECK =================


if(interaction.commandName === "vouchcheck") {


const user = interaction.options.getUser("user");


let counts = {};


if(fs.existsSync("./vouchCounts.json")) {

counts = JSON.parse(
 fs.readFileSync("./vouchCounts.json","utf8")
);

}


const total = counts[user.id] || 0;



const embed = new EmbedBuilder()

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
  // ================= GIVEAWAY =================

if (interaction.commandName === "giveaway") {


if(!interaction.member.permissions.has(
 PermissionsBitField.Flags.Administrator
)) {

return interaction.reply({
 content:"❌ You need Administrator permission."
});

}



const prize = interaction.options.getString("prize");
const duration = interaction.options.getString("duration");
const winners = interaction.options.getInteger("winners");
const channel = interaction.options.getChannel("channel");


const time = parseDuration(duration);


if(!time) {

return interaction.reply({
 content:"❌ Use format like 1m, 1h, 1d"
});

}



let data = {
 lastGiveawayId:0,
 giveaways:{}
};


if(fs.existsSync("./giveaways.json")) {

data = JSON.parse(
fs.readFileSync("./giveaways.json","utf8")
);

}



data.lastGiveawayId++;


const id = String(data.lastGiveawayId)
.padStart(4,"0");



data.giveaways[id] = {

prize:prize,

winners:winners,

users:[],

endTime:Date.now()+time,

channel:channel.id

};



fs.writeFileSync(
"./giveaways.json",
JSON.stringify(data,null,2)
);



const button = new ButtonBuilder()

.setCustomId(`join_${id}`)

.setLabel("🎉 Join Giveaway")

.setStyle(ButtonStyle.Success);



const row = new ActionRowBuilder()
.addComponents(button);



const embed = new EmbedBuilder()

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
name:"⏰ Ends",
value:duration
}

)

.setTimestamp();



await channel.send({

embeds:[embed],

components:[row]

});



interaction.reply({
content:`✅ Giveaway #${id} started.`
});



// AUTO END

setTimeout(async()=>{


let file = JSON.parse(
fs.readFileSync("./giveaways.json","utf8")
);


let giveaway = file.giveaways[id];


if(!giveaway) return;



let users = giveaway.users;


if(users.length === 0) {

channel.send("❌ No one joined the giveaway.");

return;

}



let winnersList = [];


while(
winnersList.length < giveaway.winners &&
users.length > 0
){

let random = Math.floor(
Math.random()*users.length
);


winnersList.push(
users[random]
);


users.splice(random,1);

}



const winText = winnersList
.map(x=>`<@${x}>`)
.join("\n");



channel.send({

embeds:[

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
value:winText
}

)

]

});


delete file.giveaways[id];


fs.writeFileSync(
"./giveaways.json",
JSON.stringify(file,null,2)
);


}, time);



}




// ================= GIVEAWAY BUTTON =================


if(interaction.isButton()) {


if(!interaction.customId.startsWith("join_"))
return;



const id = interaction.customId.replace(
"join_",
""
);



let data = JSON.parse(
fs.readFileSync("./giveaways.json","utf8")
);



if(!data.giveaways[id]) {

return interaction.reply({

content:"❌ Giveaway ended.",

ephemeral:true

});

}



if(data.giveaways[id].users.includes(
interaction.user.id
)) {

return interaction.reply({

content:"❌ You already joined.",

ephemeral:true

});

}



data.giveaways[id].users.push(
interaction.user.id
);



fs.writeFileSync(
"./giveaways.json",
JSON.stringify(data,null,2)
);



return interaction.reply({

content:"🎉 Joined giveaway!",

ephemeral:true

});

}



// ================= REROLL =================


if(interaction.commandName === "reroll") {


if(!interaction.member.permissions.has(
 PermissionsBitField.Flags.Administrator
)) {

return interaction.reply({
content:"❌ You need Administrator permission."
});

}



const id = interaction.options.getString("id");


let data = JSON.parse(
fs.readFileSync("./giveaways.json","utf8")
);



const giveaway = data.giveaways[id];


if(!giveaway) {

return interaction.reply({
content:"❌ Giveaway not found."
});

}



if(giveaway.users.length === 0){

return interaction.reply({
content:"❌ No participants."
});

}



const winner =
giveaway.users[
Math.floor(Math.random()*giveaway.users.length)
];



return interaction.reply({

content:
`🔄 Rerolled!\n🏆 New winner: <@${winner}>`

});


}


});


client.login(process.env.TOKEN);
