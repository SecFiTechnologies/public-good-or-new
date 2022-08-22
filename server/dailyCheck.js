const { Op } = require("sequelize");

const models = require("../database/models");

const appConstants = require("./constants");
const checkHolidays = require("./holidays/checkHolidays");
const startNewRound = require("./slackInteractions/startNewRound");
const tagUser = require("./slackInteractions/tagUser");
const getAllSlackUserIds = require("./slackInteractions/getAllSlackUserIds");

async function performDailyCheck(app) {
  try {
    const isTodayInHolidays = await checkHolidays();
    if (isTodayInHolidays) {
      // don't send anything if today is a holiday
      return `It's a holiday today. Sit back and relax :)`;
    }
    const currentRound = await models.Round.findOne({
      where: {
        isCurrent: true,
      },
    });

    if (!currentRound) {
      const newRound = await startNewRound(app, appConstants.skipRoundAction);
      newRound.isCurrent = true;
      await newRound.save();
      return;
    }

    const usersPool = [...currentRound.usersPool];

    if (usersPool.length) {
      const currentActiveUsers = await getAllSlackUserIds(app);

      // If a user is removed after the round has started, they are still included in original users pool
      // We compare to the current pool daily to make sure the user pool is up to date
      const activeUserPool = usersPool.filter((user) =>
        currentActiveUsers.includes(user)
      );

      if (activeUserPool.length) {
        await tagUser(app, activeUserPool[0]);
      }

      currentRound.usersPool = activeUserPool.slice(1);
      await currentRound.save();
    }

    // trigger to initiate new round - ideally when there's still 3-5 users in the pool
    if (usersPool.length === Number(process.env.NEW_ROUND_TRIGGER_COUNT)) {
      await startNewRound(app, appConstants.skipRoundAction);
    }

    // switch to the new round
    if (usersPool.length === 0) {
      const unstartedRound = await models.Round.findOne({
        where: {
          isCurrent: false,
          usersPool: {
            [Op.ne]: "",
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (!unstartedRound) {
        await startNewRound(app, appConstants.skipRoundAction);
        return;
      }

      const pool = [...unstartedRound.usersPool];
      if (!pool.length) {
        return "No users pool in unstarted round, stopping :/";
      }

      await tagUser(app, pool[0]);

      currentRound.isCurrent = false;
      currentRound.save();
      unstartedRound.usersPool = pool.slice(1);
      unstartedRound.isCurrent = true;
      await unstartedRound.save();
    }
    return ":all_the_things:";
  } catch (error) {
    console.log(error);
    return "Something went wrong...";
  }
}

module.exports = performDailyCheck;
