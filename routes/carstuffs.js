const express = require("express");
const router = express.Router();
const car = require("../controller/carstuffs")
const path = require("path")

// for storing file in the database
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage : storage})

const {isLoggedIn} = require("../middleware")


router.get("/allcars",car.allcars);

router.get("/addcars",isLoggedIn, car.addcarsform);
router.post("/addcars",isLoggedIn,upload.array('image'),car.carformsubmitted );
router.get('/allcars/rentedcars',isLoggedIn,car.myrentedcars)
router.get('/allcars/request',isLoggedIn,car.requestedCars)
//this is for updating in the database for isrequestaccepted
router.put('/allcars/:Req_id/request',isLoggedIn,car.acceptRequest);
router.get("/allcars/:id",car.perticularCar)
router.delete("/allcars/:id",isLoggedIn,car.deleteCar);
// ladning on your car page after clicikng on navbar




  module.exports = router;  