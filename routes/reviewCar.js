const express = require('express');
const router = express.Router({mergeParams : true}); // here we need to add mergeparams

 const reviews = require("../controller/reviews")


const { isLoggedIn} = require('../middleware');




// for inserting review data in the campground collection 
router.post("/",isLoggedIn,reviews.createReview);  
router.delete("/:reviewId",isLoggedIn,reviews.deleteReview);

module.exports  = router;