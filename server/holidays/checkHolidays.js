const dayjs = require('dayjs');
const models = require('../../database/models');

async function checkHolidays() {
  const weekends = [0, 6];
  const today = dayjs();
  if (weekends.includes(today.day())) {
    return true;
  }
  const todayFormatted = today.format('YYYY-MM-DD');
  const isTodayInHolidays = await models.Holiday.findOne({
    where: {
      date: todayFormatted,
    },
  });
  return !!isTodayInHolidays;
}

module.exports = checkHolidays;
