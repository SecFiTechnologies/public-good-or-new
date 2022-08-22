const bodyParser = require('body-parser');

const expressReceiver = require('../expressReceiver');
const roundsController = require('./roundsController');

const router = expressReceiver.router;

const jsonParser = bodyParser.json();

router.get('/rounds/', roundsController.findRounds);
router.post('/rounds/', jsonParser, roundsController.addRound);
router.get('/rounds/:id', roundsController.findRoundById);
router.put('/rounds/:id', jsonParser, roundsController.updateRound);
router.delete('/rounds/:id', roundsController.deleteRoundById);

module.exports = router;
