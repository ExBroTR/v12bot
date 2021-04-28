const Discord = require('discord.js');
const db = require('quick.db')

const moment = require('moment');
require('moment-duration-format');
const ayarlar = require('../ayarlar.json')
const prefix = ayarlar.prefix

exports.run = function (client, message, args) {
  
  var aylar = {
      "01": "Ocak",
      "02": "Şubat",
      "03": "Mart",
      "04": "Nisan",
      "05": "Mayıs",
      "06": "Haziran",
      "07": "Temmuz",
      "08": "Ağustos",
      "09": "Eylül",
      "10": "Ekim",
      "11": "Kasım",
      "12": "Aralık"
    }
    var duration = moment.duration(client.uptime).format(" D [gün] H [saat] m [dakika] s [saniye]")
  
  let gold = db.fetch(`goldüye.${message.author.id}`)
  
  var Durum = message.author.presence.status;
        var Durm = (Durum == "online" ? (0x00AE86) : (Durum == "offline" ? (0x808080) : (Durum == "idle" ? (0xFFFF00) : (Durum == "dnd" ? (0xFF0000) : (0x00AE86)))))
        var durm = (Durum == "online" ? ("Çevrimiçi :full_moon:") : (Durum == "offline" ? ("Çevrimdışı :new_moon: ") : (Durum == "idle" ? ("Boşta :crescent_moon:") : (Durum == "dnd" ? ("Rahatsız Etmeyin :no_entry:") : ("Bilinmiyor/bulunamadı.")))))
  
  var üye = message.mentions.users.first();
  if (üye) {
    const embed = new Discord.MessageEmbed()
.setAuthor(üye.username, üye.displayAvatarURL())
.setColor('RANDOM')
.setThumbnail(üye.displayAvatarURL())
.addField('Profil', `**Ad:** ${üye.username + '#' + üye.discriminator}\n**ID: ** ${üye.id}\n**Son Mesaj: ** ${üye.lastMessage}\n**Son Mesaj İD: ** ${üye.lastMessageID}\n**Oynadığı Oyun: ** ${üye.presence.activites ? üye.presence.activites.name : 'Şu an oyun oynamıyor'}\n**Durum** ${durm}\n**Oluşturulduğu Tarih: ** ${(`${moment(üye.createdAt).format('DD')} ${aylar[moment(üye.createdAt).format('MM')]} ${moment(üye.createdAt).format('YYYY HH:mm:ss')}`)}\n**Bot mu?** ${üye.bot ? ':white_check_mark:' : ':negative_squared_cross_mark:'}\n**Rolleri: ** ${message.guild.members.cache.get(üye.id).roles.cache.filter(r => r.name !== "@everyone").map(r => r).join(' **|** ')}`)
    .setTimestamp()
        .setFooter(`${client.user.tag} | ${prefix}yardım`)
message.channel.send(embed)
  } else {
const embed = new Discord.MessageEmbed()
.setAuthor(message.author.username, message.author.avatarURL())
.setColor('RANDOM')
.setThumbnail(message.author.avatarURL())
.addField('Profil', `**Ad:** ${message.author.username + '#' + message.author.discriminator}\n**ID: ** ${message.author.id}\n**Son Mesaj: ** ${message.author.lastMessage}\n**Son Mesaj İD: ** ${message.author.lastMessageID}\n**Oynadığı Oyun: ** ${message.author.presence.activites ? message.author.presence.activites.name : 'Şu an oyun oynamıyor'}\n**Durum** ${durm}\n**Oluşturulduğu Tarih: ** ${(`${moment(message.author.createdAt).format('DD')} ${aylar[moment(message.author.createdAt).format('MM')]} ${moment(message.author.createdAt).format('YYYY HH:mm:ss')}`)}\n**Bot mu?** ${message.author.bot ? ':white_check_mark:' : ':negative_squared_cross_mark:'}\n**Roller: ** ${message.guild.members.cache.get(message.author.id).roles.cache.filter(r => r.name !== "@everyone").map(r => r).join(' **|** ')}`)
.setTimestamp()
        .setFooter(`${client.user.tag} | ${prefix}yardım`)
message.channel.send(embed)
  
  }
  
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'profil',
  description: 'Profilleri Gösterir',
  usage: 'profil gösterir>'
};