const express = require('express');
const router = express();
const adminPatient = require('./adminPatient.js');
const adminDoctor  = require('./adminDoctor.js');

router.use('/patient',adminPatient);
router.use('/doctor',adminDoctor);

module.exports = router;