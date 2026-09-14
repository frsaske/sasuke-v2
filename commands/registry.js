// Single source of truth for menu visibility. Add future commands here first.
const sections = {
  General: ['.ping', '.alive', '.tts <text>', '.owner', '.joke', '.quote', '.weather <city>', '.attp <text>', '.trt <text> <lang>', '.ss <link>', '.url', '.dp', '.wow'],
  Admin: ['.ban @user', '.unban @user', '.promote @user', '.demote @user', '.mute <minutes>', '.unmute', '.kick @user', '.warnings', '.warn @user', '.antilink', '.antibadword', '.tagall', '.tagnotadmin', '.hidetag <text>', '.welcome', '.goodbye', '.setgdesc', '.setgname', '.setgpp'],
  Owner: ['.mode public/private', '.sessions', '.connect <creds>', '.disconnect sessionN', '.makeowner <number>', '.antidelete', '.cleartmp', '.setpp', '.autoreact on/off', '.autoseen on/off', '.autoonline on/off', '.autoreply on/off', '.anticall on/off', '.pmblocker on/off'],
  Media: ['.blur', '.simage', '.sticker', '.removebg', '.remini', '.crop', '.igs', '.igsc', '.meme', '.take'],
  Downloader: ['.play', '.song', '.spotify', '.instagram', '.facebook', '.tiktok', '.video'],
  Games: ['.truth', '.dare'],
  Anime: ['.anime <type>'],
  Misc: ['.gay', '.heart', '.horny'],
  AI: ['(future AI commands)']
};

const allCommands = Object.values(sections).flat().filter(x => x.startsWith('.')).map(x => x.split(' ')[0]);
const disabled = new Set([
  '.8ball', '.fact', '.news', '.groupinfo', '.infogp', '.infogrupo', '.lyrics', '.pies', '.china', '.indonesia', '.japan', '.korea', '.hijab',
  '.emojimix', '.emix', '.metallic', '.ice', '.snow', '.impressive', '.matrix', '.light', '.neon', '.devil', '.purple', '.thunder', '.leaves', '.1917', '.arena', '.hacker', '.sand', '.blackpink', '.glitch', '.fire',
  '.circle', '.lgbt', '.lolice', '.simpcard', '.its-so-stupid', '.namecard', '.oogway', '.oogway2', '.tweet', '.ytcomment', '.comrade', '.glass', '.jail', '.passed', '.triggered',
  '.compliment', '.insult', '.flirt', '.shayari', '.goodnight', '.roseday', '.character', '.wasted', '.ship', '.simp', '.stupid',
  '.git', '.github', '.sc', '.script', '.repo', '.gpt', '.gemini', '.imagine', '.flux', '.dalle', '.sora', '.vv'
]);
function isDisabled(command) { return disabled.has(command); }
function render(title = 'ꜱᴀꜱᴜᴋᴇX MENU', includeDisabled = false) {
  const source = includeDisabled ? { ...sections, Disabled: [...disabled] } : sections;
  return `╭━━〔 ${title} 〕━━╮\n${Object.entries(source).map(([name, cmds]) => `\n┃ ✦ *${name}*\n${cmds.map(c => `┃  ${c}`).join('\n')}`).join('\n')}\n╰━━━━━━━━━━━━━━╯`;
}
module.exports = { sections, allCommands, disabled, isDisabled, render };
