const models = require('../../database/models');

async function add(req, res) {
  try {
    const round = await models.Round.create(req.body);
    return res.status(201).json({
      round,
    });
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

async function findById(req, res) {
  try {
    const { id } = req.params;
    const round = await models.Round.findOne({
      where: { id },
    });
    if (round) {
      return res.status(200).json({ round });
    }
    return res.status(404).send('Round with the specified ID does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function deleteById(req, res) {
  try {
    const { id } = req.params;
    const deleted = await models.Round.destroy({
      where: { id }
    });
    if (deleted) {
      return res.status(204).send("Round deleted");
    }
    throw new Error("Round not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const [ updated ] = await models.Round.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedRound = await models.Round.findOne({ where: { id } });
      return res.status(200).json({ round: updatedRound });
    }
    throw new Error('Round not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function findAll(req, res) {
  try {
    const rounds = await models.Round.findAll();
    return res.status(200).json({ rounds });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  addRound: add,
  findRoundById: findById,
  updateRound: update,
  deleteRoundById: deleteById,
  findRounds: findAll,
};
