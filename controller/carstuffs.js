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
      // console.log(element._id);
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

// after clicking my cars in navbar
module.exports.myrentedcars = async (req, res) => {



  const current = await User.findById(req.user).populate("rentedcar");
  var arryRequestAccepted = [];
  var objectRequestAccepted = {};
  let rentedCarLength = parseInt(current.rentedcar.length)
   for(let i =0;i<rentedCarLength;i++){
     var carm = await carschema.findById(current.rentedcar[i]._id).populate({path : "author",populate : {path:"reqFrom"}});
     var carOwner = await User.findById(carm.author._id).populate('reqFrom');
    //  console.log(carOwner);
    //  console.log('\n')
     var requestCarLength = parseInt(carOwner.reqFrom.length)
     console.log(requestCarLength);
      for(let j = 0;j<requestCarLength;j++){
        // console.log(carOwner.reqFrom[j].userId.toString())
        // console.log(carOwner.reqFrom[j].carId.toString())
      if(carOwner.reqFrom[j].userId.toString()==req.user._id && carOwner.reqFrom[j].carId.toString()==current.rentedcar[i]._id){
        objectRequestAccepted = {}
        objectRequestAccepted.image = current.rentedcar[i].image;
        objectRequestAccepted.carname = current.rentedcar[i].carname;
        objectRequestAccepted.cardesc = current.rentedcar[i].cardesc;
        objectRequestAccepted.year = current.rentedcar[i].year;
        objectRequestAccepted.workon = current.rentedcar[i].workon;
        objectRequestAccepted.distance = current.rentedcar[i].distance;
        objectRequestAccepted.rent = current.rentedcar[i].rent;
        objectRequestAccepted.isRequesteAccepted = carOwner.reqFrom[j].isRequesteAccepted;
        arryRequestAccepted.push(objectRequestAccepted);
      }
    }
   };
  // console.log(arryRequestAccepted)
 // res.send(arryRequestAccepted);
  res.render("./views/car/rentedCar", { arryRequestAccepted });
};


// requests that car owner got after clicking navbar car request
module.exports.requestedCars = async(req,res)=>{
  const carOwner = await User.findById(req.user).populate("reqFrom");
  const requestedCar = carOwner.reqFrom;
  var objOfUser = {};
  var arrOfUser = [];
  var length = parseInt(requestedCar.length);
  for(let i = 0;i<length;i++){
    let userID = requestedCar[i].userId.toString()
    let carID = requestedCar[i].carId.toString();
    let requestedUserinfo = await User.findById(userID);
    let requestedCarinfo  = await carschema.findById(carID);
    objOfUser = {};
    objOfUser.userName = requestedUserinfo.username;
    objOfUser.carname = requestedCarinfo.carname;
    objOfUser.image = requestedCarinfo.image;
    objOfUser.Req_id = requestedCar[i]._id;
    objOfUser.isAlreadyAccepted = requestedCar[i].isRequesteAccepted
    arrOfUser.push(objOfUser)
  }
  // res.send(arrOfUser);
  res.render("./views/car/carRequest",{arrOfUser})
}




// after cicking accept button in car request
module.exports.acceptRequest =  async(req,res)=>{
  const {Req_id} = req.params;
  const carOwner = await User.findById(req.user).populate("reqFrom");
  let updated = await User.findOneAndUpdate(
    { "_id": carOwner._id, "reqFrom._id": Req_id },
    { $set: { "reqFrom.$.isRequesteAccepted": true } },
    { returnOriginal: false }
  )

  res.redirect("/car/allcars");
}
