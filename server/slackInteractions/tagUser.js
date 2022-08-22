const tagUser = async (app, user) =>
  await app.client.chat.postMessage({
    channel: process.env.CHANNEL_ID,
    text: `Good morning :sunrise: Today for Good or New is.... 🥁🥁🥁 <@${user}|cal>!!`,
    token: process.env.SLACK_BOT_TOKEN,
  });

module.exports = tagUser;
