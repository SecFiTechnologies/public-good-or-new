async function getAllSlackUserIds(app) {
  try {
    const allSlackUsers = await app.client.users.list({
      token: process.env.SLACK_BOT_TOKEN
    });
    return allSlackUsers.members
      // get all real users
      .filter(member =>
        member.is_bot === false &&
        member.is_email_confirmed === true &&
        member.is_restricted === false &&
        member.is_ultra_restricted === false
      )
      // get only id property
      .map(({id}) => id)
      // randomize sorting token
      .map((a) => ({sort: Math.random(), value: a}))
      // sort by random value
      .sort((a, b) => a.sort - b.sort)
      // return back original value
      .map((a) => a.value);
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = getAllSlackUserIds;
