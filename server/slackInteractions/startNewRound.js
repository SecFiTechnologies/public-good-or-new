const models = require('../../database/models');

const getAllSlackUserIds = require('./getAllSlackUserIds');

const getMessage = (
  companyName
) => `You can share anything that you feel like — a funny story,\
 a memory from your past, a great book you have read recently, a new song, an exciting\
 life change — anything and everything is acceptable! Let's connect more with each other and\
 learn new things about the ${companyName} family :slightly_smiling_face: The participants will be randomized and you will be tagged\
 by the Good or New bot on the day it is your turn to share — start brainstorming! :brain:`;

const startNewRound = async (app, action) => {
  const users = await getAllSlackUserIds(app);

  const newRound = await models.Round.create({
    usersPool: users,
    isCurrent: false,
  });

  const team = await app.client.team.info({
    token: process.env.SLACK_BOT_TOKEN,
  });

  const teamName = (team && team.team.name) || 'work';

  users.forEach(async (userId) => {
    await app.client.chat.postMessage({
      channel: userId,
      token: process.env.SLACK_BOT_TOKEN,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `:boom: A new round of Good or New is starting soon! :boom:`,
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: getMessage(teamName),
            emoji: true,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                emoji: true,
                text: 'Skip this round',
              },
              style: 'danger',
              action_id: action,
            },
          ],
        },
      ],
    });
  });

  return newRound;
};

module.exports = startNewRound;
