const fs = require('fs');
const path = require('path');
const axios = require('axios');
const isOwnerOrSudo = require('../lib/isOwner');
const CONFIG = path.join(process.cwd(), 'data', 'autoFeatures.json');
const defaults = { autoreact: false, autoseen: false, autoonline: false, autoreply: false };
function read() { try { return { ...defaults, ...JSON.parse(fs.readFileSync(CONFIG, 'utf8')) }; } catch (_) { return { ...defaults }; } }
function save(data) { fs.writeFileSync(CONFIG, JSON.stringify(data, null, 2)); }
async function toggle(sock, chatId, message, feature, value) {
  const sender = message.key.participant || message.key.remoteJid;
  if (!message.key.fromMe && !(await isOwnerOrSudo(sender, sock, chatId))) return sock.sendMessage(chatId, { text: '❌ Owner only command.' }, { quoted: message });
  const data = read();
  if (!['on', 'off', 'status'].includes(value)) return sock.sendMessage(chatId, { text: `Usage: .${feature} on/off` }, { quoted: message });
  if (value === 'status') return sock.sendMessage(chatId, { text: `.${feature}: ${data[feature] ? 'ON' : 'OFF'}` }, { quoted: message });
  data[feature] = value === 'on'; save(data);
  return sock.sendMessage(chatId, { text: `✅ ${feature}: ${data[feature] ? 'ON' : 'OFF'}` }, { quoted: message });
}
async function handleAutoReply(sock, chatId, message, text) {
  const data = read(); if (!data.autoreply || !text || message.key.fromMe) return;
  const key = process.env.GROQ_API_KEY; if (!key) return;
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', { model: 'llama-3.1-8b-instant', messages: [{ role: 'user', content: text }], max_tokens: 120 }, { headers: { Authorization: `Bearer ${key}` } });
    const answer = response.data?.choices?.[0]?.message?.content?.trim(); if (answer) await sock.sendMessage(chatId, { text: answer });
  } catch (error) { console.error('[autoreply]', error.message); }
}
async function handlePresence(sock, message) {
  const data = read(); if (data.autoseen) try { await sock.readMessages([message.key]); } catch (_) {}
  if (data.autoonline) try { await sock.sendPresenceUpdate('available', message.key.remoteJid); } catch (_) {}
}
module.exports = { read, toggle, handleAutoReply, handlePresence };
