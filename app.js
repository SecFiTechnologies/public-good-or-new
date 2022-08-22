require('dotenv').config();
const { App } = require('@slack/bolt');
const expressReceiver = require('./server/expressReceiver');
const appConstants = require('./server/constants');
const performDailyCheck = require('./server/dailyCheck');
const handleSkip = require('./server/slackInteractions/handleSkip');
const getAllSlackUserIds = require('./server/slackInteractions/getAllSlackUserIds');

// init CRUD routes
require('./server/users/usersRouter');
require('./server/rounds/roundsRouter');
require('./server/holidays/holidaysRouter');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: expressReceiver,
});

expressReceiver.router.get('/daily-check/', async (req, res) => {
  try {
    const response = await performDailyCheck(app);
    return res.status(200).send(response);
  } catch (error) {
    console.error('error: ', JSON.stringify(error));
    return res.status(500).send(error.message);
  }
});

expressReceiver.router.get('/slack-users/', async (req, res) => {
  try {
    const allUsers = await getAllSlackUserIds(app);
    return res.status(200).json({ allUsers });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.action(appConstants.skipRoundAction, async ({ body, ack, say }) => {
  try {
    await handleSkip(body, ack, say);
  } catch (error) {
    console.error('error: ', JSON.stringify(error));
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Good or New app is running!');
})();
