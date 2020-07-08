const express = require('express');
const router = express();
const crud = require('./patient_CRUD.js');

router.use(crud);

module.exports = router;