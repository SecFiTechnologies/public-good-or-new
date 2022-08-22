const models = require('../../database/models');

async function add(req, res) {
  try {
    const holiday = await models.Holiday.create(req.body);
    return res.status(201).json({
      holiday,
    });
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

async function findById(req, res) {
  try {
    const { id } = req.params;
    const holiday = await models.Holiday.findOne({
      where: { id },
      include: [
        {
          model: models.Round,
          as: 'rounds',
        },
      ]
    });
    if (holiday) {
      return res.status(200).json({ holiday });
    }
    return res.status(404).send('Holiday with the specified ID does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function deleteById(req, res) {
  try {
    const { id } = req.params;
    const deleted = await models.Holiday.destroy({
      where: { id }
    });
    if (deleted) {
      return res.status(204).send("Holiday deleted");
    }
    throw new Error("Holiday not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const [ updated ] = await models.Holiday.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedHoliday = await models.Holiday.findOne({ where: { id } });
      return res.status(200).json({ holiday: updatedHoliday });
    }
    throw new Error('Holiday not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function findAll(req, res) {
  try {
    const holidays = await models.Holiday.findAll();
    return res.status(200).json({ holidays: holidays.map(({id, date}) => ({id, date})) });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  addHoliday: add,
  findHolidayById: findById,
  updateHoliday: update,
  deleteHolidayById: deleteById,
  findHolidays: findAll,
};
