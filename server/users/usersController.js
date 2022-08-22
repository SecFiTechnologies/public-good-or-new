const models = require('../../database/models');

async function add(req, res) {
  try {
    const user = await models.User.create(req.body);
    return res.status(201).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

async function findById(req, res) {
  try {
    const { id } = req.params;
    const user = await models.User.findOne({
      where: { id }
    });
    if (user) {
      return res.status(200).json({ user });
    }
    return res.status(404).send('User with the specified ID does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function deleteById(req, res) {
  try {
    const { id } = req.params;
    const deleted = await models.User.destroy({
      where: { id }
    });
    if (deleted) {
      return res.status(204).send("User deleted");
    }
    throw new Error("User not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const [ updated ] = await models.User.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedUser = await models.User.findOne({ where: { id } });
      return res.status(200).json({ user: updatedUser });
    }
    throw new Error('User not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function findAll(req, res) {
  try {
    const users = await models.User.findAll();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  addUser: add,
  findUserById: findById,
  updateUser: update,
  deleteUserById: deleteById,
  findUsers: findAll,
};
