const express = require("express");
const Review = require('../models/reviews');
const carschema = require('../models/cars')



module.exports.createReview = async (req, res) => {
    const car = await carschema.findById(req.params.id);
    const review = new Review(req.body);
    // res.send(car);
    car.reviews.push(review);
    await review.save();
    await car.save();
    res.redirect(`/car/allcars/${car._id}`)
  }

module.exports.deleteReview = async (req,res)=>{
    const {id,reviewId} = req.params;
    carschema.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    // req.flash('success','Successfully deleted the review')
    res.redirect(`/car/allcars/${id}`); // here we pass link url u can say
  }