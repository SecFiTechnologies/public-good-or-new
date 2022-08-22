const bodyParser = require('body-parser');

const expressReceiver = require('../expressReceiver');
const holidaysController = require('./holidaysController');

const router = expressReceiver.router;

const jsonParser = bodyParser.json();

router.get('/holidays/', holidaysController.findHolidays);
router.post('/holidays/', jsonParser, holidaysController.addHoliday);
router.get('/holidays/:id', holidaysController.findHolidayById);
router.put('/holidays/:id', jsonParser, holidaysController.updateHoliday);
router.delete('/holidays/:id', holidaysController.deleteHolidayById);

module.exports = router;
