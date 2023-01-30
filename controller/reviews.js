const express = require("express");
const Review = require('../models/reviews');
const carschema = require('../models/cars')



module.exports.createReview = async (req, res) => {
    const car = await carschema.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user;
    car.reviews.push(review);
    await review.save();
    await car.save();
    // res.send(car.reviews);
     res.redirect(`/car/allcars/${car._id}`)
  }

module.exports.deleteReview = async (req,res)=>{
    const {id,reviewId} = req.params;
    carschema.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/car/allcars/${id}`); // here we pass link url u can say
  }