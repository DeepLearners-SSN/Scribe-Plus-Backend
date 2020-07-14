const express = require('express');
const router = express();
const upload = require("./doctor_upload.js");
const crud   = require("./doctor_CRUD.js");
const appointment = require('./doctor_appointment');


router.use('/upload', upload);
router.use('/appointment', appointment);
router.use(crud);


module.exports = router;