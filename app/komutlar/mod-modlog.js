const Discord = require('discord.js');
const db = require("quick.db")
exports.run = async (client, message, args) => {
  
  
  
  try {
      if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(new Discord.MessageEmbed().setAuthor("Lrows Bot",client.user.avatarURL()).setColor("RANDOM").setFooter("Lrows").setDescription("Komutu Kullanmak için Yetkiniz Bulunmamaktadır **")) ;

  if(!args[0]) return message.channel.send(new Discord.MessageEmbed().setAuthor("Lrows",client.user.avatarURL()).setColor("#DARKBLUE").setFooter("Lrows").setDescription("Komutu Yanlış Kullandın Doğru Kullanımı : !mod-log ayarla/sıfırla**")) ;
 
  if(args[0] === "ayarla") {
    let kanal = message.mentions.channels.first()
         if(!kanal) return message.channel.send(new Discord.MessageEmbed().setAuthor("Lrows",client.user.avatarURL()).setColor("#DARKBLUE").setDescription(" Komutu Yanlış Kullandın Doğru Kullanımı : !mod-log ayarla #kanal**").setFooter("Lrows"));
    if(kanal) {
   db.set(`logKanal_${message.guild.id}`,kanal.id)
    message.channel.send(new Discord.MessageEmbed().setAuthor("Lrows Bot", client.user.avatarURL()).setColor("#DARKBLUE").setFooter("Lrows ").setDescription(`✔️| MOD-LOG Sistemi Başarıyla Açıldı**`))
    }
    }
  
   if(args[0] === "sıfırla") {
    db.delete(`logKanal_${message.guild.id}`)
    message.channel.send(new Discord.MessageEmbed().setAuthor("Lrows Bot", client.user.avatarURL()).setColor("#DARKBLUE").setFooter("Lrows").setDescription(`❌ **| MOD-LOG Sistemi Başarıyla Kapatıldı**`))
  }
  }catch{};
   };
exports.conf = {
  enabled: true, 
  guildOnly: true, 
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: 'mod-log', 
  description: 'sunucudaki hareketlikleri belirlenen kanala atar',
  usage: ''
};