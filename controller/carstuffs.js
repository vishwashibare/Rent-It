const express = require("express");
const carschema = require("../models/cars");
const User = require("../models/user");

// to view all cars
module.exports.allcars = async (req, res) => {
  const cars = await carschema.find({});
  //res.send(cars);
  res.render("./views/car/showcars.ejs", { cars });
};

// this is the form for adding car
module.exports.addcarsform = (req, res) => {
  res.render("./views/car/addcars.ejs");
};

// this is the post request for adding car in the database
module.exports.carformsubmitted = async (req, res) => {
  const cardata = new carschema(req.body);
  const cardataimage = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  cardata.image = cardataimage;
  // res.send(req.user._id);
  const user = req.user._id;
  cardata.author = user;
  await cardata.save();
  // res.send(cardata);
  res.redirect("/car/allcars");
};

// perticular page after clicking explore
module.exports.perticularCar = async (req, res) => {
  let isrented = false;
  const car = await carschema
    .findById(req.params.id)
    .populate("author")
    .populate({ path: "reviews", populate: { path: "author" } });
  if (req.user) {
    const currentuser = await User.findById(req.user._id).populate("rentedcar");
    currentuser.rentedcar.forEach((element) => {
      console.log(element._id);
      if (req.params.id == element._id) {
        isrented = true;
      }
    });
  }
  //  res.send(car);
  const currentDate = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const dateString = currentDate.toLocaleString("en-US", options);

  res.render("./views/car/perticularCar", { car, isrented, dateString });
};

module.exports.deleteCar = async (req, res) => {
  const { id } = req.params;
  await carschema.findByIdAndDelete(id);
  res.redirect("/car/allcars"); // here we pass link url u can say
};

module.exports.myrentedcars = async (req, res) => {
  //res.send("req.user");
  const current = await User.findById(req.user).populate("rentedcar");
  res.render("./views/car/rentedCar", { current });
};
