const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  console.log(
    `Az Önce Bot Ping yedi, Sorun önemli değil merak etme. Hatayı düzelttik.`
  );
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
const Discord = require("discord.js");
const db = require('quick.db')
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const fs = require("fs");
const moment = require("moment");
moment.locale("tr")
const chalk = require("chalk");
require("./util/eventLoader")(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity(`Lrows`);
});

//Botu 7/24 seste tutma
client.on("ready", () => {
  client.channels.cache.get("836739887288811600").join();   
})
//KOD BİTTİ

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

//BOTA ATILAN  MESAJLARI GÖRME
client.on("message", msg => {
  var dm = client.channels.cache.get("836738027669553192"); //mesajın geleceği kanal idsi//
  if (msg.channel.type === "dm") {
    if (msg.author.id === client.user.id) return;
    const botdm = new Discord.MessageEmbed()
      .setTitle(`${client.user.username} Dm`)
      .setTimestamp()
      .setColor("BLUE")
      .setThumbnail(`${msg.author.avatarURL()}`)
      .addField(":boy: Gönderen ",  msg.author.tag)
      .addField(":id:  Gönderen ID :", msg.author.id)
      .addField(":globe_with_meridians: Gönderilen Mesaj", msg.content);

    dm.send(botdm);
  }
  if (msg.channel.bot) return;
});
//Kod bitti

//Ayarlamalı sa as kodu 
client.on('message', async (msg, member, guild) => {
  let i = await  db.fetch(`saas_${msg.guild.id}`)
      if(i === 'açık') {
        if (msg.content.toLowerCase() === 'sa') {
        msg.reply('Aleyküm Selam Hoşgeldin');      
      } 
      }
    });
//kod bitti

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};



client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};


// --------------------------- MOD LOG --------------------------

client.on('channelUpdate', async channel => {
  try {
  const guild = channel.guild;
  const logKanalID = await db.fetch(`logKanal_${guild.id}`)
  if(logKanalID == null || !logKanalID) return
  const logKanal = guild.channels.cache.get(logKanalID)
  guild.fetchAuditLogs(11).then(a=>{
    const kanal = a.entries.first()
    var degişiklik;
    var multiply;
    if(kanal.changes[0].key =='name') {
      degişiklik = 'İsim güncellemesi.'
      multiply = `Eski isim: ${kanal.changes[0].old}\nYeni isim: ${kanal.changes[0].new}`
    }
    if(kanal.changes[0].key =='nsfw') {
        degişiklik = 'NSFW'
      if(kanal.changes[0].old == false) {
       multiply = `NSFW Özelliği açıldı.`
      }
      else if(kanal.changes[0].old == true) multiply = `NSFW Özelligi kapatıldı.`
    }
    if (kanal.changes[0].key == "id") {
      degişiklik = "Kanaldaki bir rolün yada kişinin yetkisi güncellendi.";
      if (kanal.changes[1].key == "type") {
        if (kanal.changes[1].old == "member" || kanal.changes[1].new == "member") {
          if (kanal.changes[1].old == "member") {
            multiply = `<@${kanal.changes[0].old}>'in üzerinde birşeyler oldu.`;
          } else {
            multiply = `<@${kanal.changes[0].new}>'in üzerinde birşeyler oldu.`;
          }
        } else if (kanal.changes[1].old == "role" || kanal.changes[1].new == "role") {
          if (kanal.changes[1].old == "role") {
            multiply = `<@&${kanal.changes[0].old}>'in üzerinde birşeyler oldu.`;
          } else {
            multiply = `<@&${kanal.changes[0].new}>'in üzerinde birşeyler oldu.`;
          }
        }
      }
    }else if(kanal.changes[0].key.includes('allow')) return
   if(kanal.changes[0].key == 'rate_limit_per_user') {
     degişiklik = 'Kanaldaki mesaj atma süresi güncellendi.'
     if(kanal.changes[0].old != 0) {
       multiply = `Kanalın mesaj gönderilme süresi kapatıldı.`
     }else if (kanal.changes[0].old == 0) {
       multiply = `Kanalın mesaj gönderilme süresi ayarlandı. Süre: ${kanal.changes[0].new} Saniye.`
     }
   }
    var user = a.entries.first().executor
    const embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Kanal güncellendi.')
    .addField('Kanalı Güncelliyen:',user.username,true)
    .addField('Güncellenen kanal:',kanal.target.name,true)
    .addField('Güncellenen:',degişiklik,true)
    .addField('Güncelleme Bilgisi:',multiply,true)
    .setFooter(`${client.user.username} Log sistemi.`,guild.iconURL({dynamic:true}))
    .setTimestamp()
    logKanal.send(embed)
  })
  } catch{}
})
client.on('channelCreate', async channel => {
  try {
    if(!channel.guild) return
    const  guild = channel.guild;
    const logKanalID = await db.fetch(`logKanal_${guild.id}`)
    if(logKanalID == null || !logKanalID) return
    const logKanal = guild.channels.cache.get(logKanalID)
    guild.fetchAuditLogs(10).then(a=>{
    const kanal = a.entries.first()
    const user = a.entries.first().executor
    const embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Kanal oluşturuldu.')
    .addField('Kanalı oluşturan:',user.username,true)
    .addField('Kanalın ismi:',kanal.target.name,true)
    .addField('Kanal ID:',kanal.target.id,true)
    .setFooter(`${client.user.username} Log sistemi.`,guild.iconURL({dynamic:true}))
    .setTimestamp()
    logKanal.send(embed)
   })   
  } catch{}
})
client.on('channelDelete', async channel => {
  try {
    const  guild = channel.guild;
    const logKanalID = await db.fetch(`logKanal_${guild.id}`)
    if(logKanalID == null || !logKanalID) return
    const logKanal = guild.channels.cache.get(logKanalID)
    guild.fetchAuditLogs(12).then(a=>{
    const kanal = a.entries.first()
    const user = a.entries.first().executor
    const embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Kanal silindi.')
    .addField('Kanalı silen:',user.username,true)
    .addField('Kanalın ismi:',channel.name,true)
    .addField('Kanal ID:',channel.id,true)
    .setFooter(`${client.user.username} Log sistemi.`,guild.iconURL({dynamic:true}))
    .setTimestamp()
    logKanal.send(embed)
   })   
  } catch{}
})
client.on('emojiCreate', async emoji => {
  try {
    const guild = emoji.guild;
    const logKanalID = await db.fetch(`logKanal_${guild.id}`)
    if(logKanalID == null || !logKanalID) return
    const logKanal = guild.channels.cache.get(logKanalID)
    guild.fetchAuditLogs(60).then(a=>{
    const user = a.entries.first().executor
    const embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Emoji oluşturuldu.')
    .addField('Emojiyi oluşturan:',user.username,true)
    .addField('Emoji ismi:',emoji.name,true)
    .addField('Emoji ID:',emoji.id,true)
    .setThumbnail(emoji.url)
    .setFooter(`${client.user.username} Log sistemi.`,guild.iconURL({dynamic:true}))
    .setTimestamp()
    logKanal.send(embed)
    })
  } catch{}
})
client.on('emojiDelete', async emoji => {
  try {
    const guild = emoji.guild;
    const logKanalID = await db.fetch(`logKanal_${guild.id}`)
    if(logKanalID == null || !logKanalID) return
    const logKanal = guild.channels.cache.get(logKanalID)
    guild.fetchAuditLogs(62).then(a=>{
    const user = a.entries.first().executor
    const embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Emoji silindi.')
    .addField('Emojiyi silen:',user.username,true)
    .addField('Emoji ismi:',emoji.name,true)
    .addField('Emoji ID:',emoji.id,true)
    .setThumbnail(emoji.url)
    .setFooter(`${client.user.username} Log sistemi.`,guild.iconURL({dynamic:true}))
    .setTimestamp()
    logKanal.send(embed)
    })
  } catch{}
})
client.on('roleCreate', async role => {
  try {
  const guild = role.guild;
  const logKanalID = await db.fetch(`logKanal_${guild.id}`)
  if(logKanalID == null || !logKanalID) return
  const logKanal = guild.channels.cache.get(logKanalID)
  guild.fetchAuditLogs(30).then(a=>{
  const rol = a.entries.first()
  const user = a.entries.first().executor
  const embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Rol oluşturuldu.')
    .addField('Rolü oluşturan:',user.username,true)
    .addField('Oluşturulan rol:',rol.target.name,true)
    .addField('Rol ID:',role.id,true)
    .setFooter(`${client.user.username} Log sistemi.`,guild.iconURL({dynamic:true}))
    .setTimestamp()
    logKanal.send(embed)
   })
    } catch{}
})
client.on('roleDelete', async role => {
  try {
  const guild = role.guild;
  const logKanalID = await db.fetch(`logKanal_${guild.id}`)
  if(logKanalID == null || !logKanalID) return
  const logKanal = guild.channels.cache.get(logKanalID)
  guild.fetchAuditLogs(32).then(a=>{
  const rol = a.entries.first()
  const user = a.entries.first().executor
  const embed = new Discord.MessageEmbed()
    .setColor(role.hexColor)
    .setTitle('Rol silindi.')
    .addField('Rolü silen:',user.username,true)
    .addField('Silinen rol:',role.name,true)
    .addField('Rol ID:',role.id,true)
    .setFooter(`${client.user.username} Log sistemi.`,guild.iconURL({dynamic:true}))
    .setTimestamp()
    logKanal.send(embed)
   })
    } catch{}
})

client.on('messageUpdate', async (oldMessage,newMessage) =>{
  try {
  if(!oldMessage.guild && !newMessage.guild) return
  if( newMessage == '') return
  if(oldMessage.author.bot && newMessage.author.bot) return
  const guild = oldMessage.guild || newMessage.guild
  const logKanalID = await db.fetch(`logKanal_${guild.id}`)
  if(logKanalID == null || !logKanalID) return
  const logKanal = guild.channels.cache.get(logKanalID)
  const embed = new Discord.MessageEmbed()
   .setColor('RANDOM')
     .setTitle('Mesaj güncellendi.')
     .addField('Mesaj sahibi:',oldMessage.author.tag)
     .addField('Eski mesaj:',oldMessage,true)
     .addField('Yeni mesaj:',newMessage,true)
     .setFooter(`${client.user.username} Log sistemi.`,guild.iconURL({dynamic:true}))
     .setTimestamp()
     .setThumbnail(oldMessage.author.avatarURL({size:4096,dynamic:true}))
    logKanal.send(embed)
  } catch{}
})
client.on('messageDelete', async message => {
  try {
    
   if(!message.guild) return
  if(message.author.bot) return
  const guild = message.guild
  const logKanalID = await db.fetch(`logKanal_${guild.id}`)
  if(logKanalID == null || !logKanalID) return
  const logKanal = guild.channels.cache.get(logKanalID)
  const embed = new Discord.MessageEmbed()
   .setColor('RANDOM')
     .setTitle('Mesaj silindi.')
     .addField('Mesaj sahibi:',message.author.tag)
     .addField('Silinen mesaj:',message.content,true)
     .setFooter(`${client.user.username} Log sistemi.`,guild.iconURL({dynamic:true}))
     .setTimestamp()
     .setThumbnail(message.author.avatarURL({size:4096,dynamic:true}))
    logKanal.send(embed)
    } catch{}
})
//kod bitti

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(process.env.token);

//--------------------------------ROL KORUMA SİSTEMİ -------------------------------\\
client.on('guildMemberUpdate', async (oldMember, newMember) => {
let guild = oldMember.guild || newMember.guild;
  
    let lrows = await guild.fetchAuditLogs({type: 'MEMBER_ROLES_UPDATE'});
  
    if(lrows) {
      
let lrowsrol = []

oldMember.roles.cache.forEach(c => {
if(!newMember.roles.cache.has(c.id)) {
require('quick.db').delete(`${guild.id}.${c.id}.${oldMember.id}`)
}
})
newMember.roles.cache.forEach(c => {
if(!oldMember.roles.cache.has(c.id)) {
require('quick.db').set(`${guild.id}.${c.id}.${newMember.id}`, 'eklendi')
}
  
})
    
    }
})

client.on('roleDelete', async role => {
let guild = role.guild;
  
  let e = await guild.fetchAuditLogs({type: 'ROLE_DELETE'});
  let member = guild.members.cache.get(e.entries.first().executor.id);
  //if(member.hasPermission("ADMINISTRATOR")) return;
        
  let mention = role.mentionable;
  let hoist = role.hoist;
  let color = role.hexColor;
  let name = role.name;
  let perms = role.permissions;
  let position = role.position;
  role.guild.roles.create({
    name: name,
    color: color,
    hoist: hoist,
    position: position,
    permissions: perms,
    mentionable: mention
  }).then(async rol => {
    
  guild.members.cache.forEach(async u => {
  const dat = await require('quick.db').fetch(`${guild.id}.${role.id}.${u.id}`)
  if(dat) {

  guild.members.cache.get(u.id).roles.add(rol.id)
  }
    
  })
client.channels.cache.get('836738707595329566').send(new Discord.MessageEmbed().setAuthor(guild.name, guild.iconURL()).setTitle(`Bir rol silindi!`)
.setDescription(`${rol.name} isimli rol ${member} tarafından silindi ve bende tekrardan rolü oluşturdum.`))
  })
  
})


client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});