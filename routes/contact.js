const express = require("express");
const router = express.Router();
const car = require("../controller/contact")


router.get('/',car.contactform);
router.post('/',car.formsubmitted);

module.exports = router;  