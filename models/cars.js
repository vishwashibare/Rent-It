const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");


const carschema = new Schema({
    carname : String,
    rent : Number,
    cardesc : String,
    author: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      
    },
    image: [{
      url: String,
      filename: String
    }],
    year : Number,
    workon : {
        type : String,
        enum : ['petrol','Diesel','Electricity'],
    },
    distance : Number,
    reviews: [
        {
          type: Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
})

// mongoose middle ware , yach use jevha apan ek purn campground delete karto tyche serv reviews pn delete honar reviews collection madhe jaun
carschema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const car = mongoose.model("car", carschema);
module.exports = car;