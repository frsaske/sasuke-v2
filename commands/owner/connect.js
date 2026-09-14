const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../../lib/isOwner');

module.exports = async function connectCommand(sock, chatId, message, rawJson) {
  const sender = message.key.participant || message.key.remoteJid;
  if (!message.key.fromMe && !(await isOwnerOrSudo(sender, sock, chatId))) {
    return sock.sendMessage(chatId, { text: '❌ Owner only command.' }, { quoted: message });
  }
  if (!rawJson) return sock.sendMessage(chatId, { text: 'Usage: /connect <raw creds.json>' }, { quoted: message });
  try {
    const creds = JSON.parse(rawJson);
    if (!creds || typeof creds !== 'object' || !creds.me) throw new Error('Invalid Baileys credentials');
    const name = global.getNextSessionName();
    const dir = path.join(process.cwd(), 'sessions', name);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'creds.json'), JSON.stringify(creds, null, 2));
    if (typeof global.startSession !== 'function') throw new Error('Session manager unavailable');
    await global.startSession(name);
    const number = creds.me?.id?.split(':')[0]?.split('@')[0] || 'unknown';
    return sock.sendMessage(chatId, { text: `✅ ${name} connected | 📱 ${number}` }, { quoted: message });
  } catch (error) {
    console.error(`[connect] ${error.stack || error}`);
    return sock.sendMessage(chatId, { text: `❌ Could not connect session: ${error.message}` }, { quoted: message });
  }
};
