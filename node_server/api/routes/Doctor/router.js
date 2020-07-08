const express = require('express');
const router = express();
const upload = require("./doctor_upload.js");
const crud   = require("./doctor_CRUD.js");


router.use('/upload',upload);
router.use(crud);


module.exports = router;