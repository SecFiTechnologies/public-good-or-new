const bodyParser = require('body-parser');

const expressReceiver = require('../expressReceiver');
const usersController = require('./usersController');

const router = expressReceiver.router;

const jsonParser = bodyParser.json();

router.get('/users/', usersController.findUsers);
router.post('/users/', jsonParser, usersController.addUser);
router.get('/users/:id', usersController.findUserById);
router.put('/users/:id', jsonParser, usersController.updateUser);
router.delete('/users/:id', usersController.deleteUserById);

module.exports = router;
