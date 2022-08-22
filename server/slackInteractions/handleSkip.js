const { Op } = require('sequelize');

const models = require('../../database/models');

const handleSkip = async (body, ack, say) => {
  await ack();

  const latestRound = await models.Round.findOne({
    order: [['createdAt', 'DESC']],
  });

  if (!latestRound) {
    return 'No rounds available, stopping :/';
  }

  const usersPool = [...latestRound.usersPool];

  if (!usersPool.includes(body.user.id)) {
    await say(
      `<@${body.user.id}>, don't worry, you have already skipped this round!`
    );
    return;
  }

  latestRound.usersPool = usersPool.filter((id) => id !== body.user.id);
  await latestRound.save();

  await say(
    `<@${body.user.id}>, you have been removed from the upcoming round.`
  );
};

module.exports = handleSkip;
