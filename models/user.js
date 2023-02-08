const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // cars he posted for rent
  rentedcar: [
    {
      type: Schema.Types.ObjectId,
      ref: "car",
    },
  ],
  
  // jevha apan ithe takal tevha te car owner asnar
  reqFrom: [
    {
      // konala rent pahije
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      // konti car rent pahije
      carId: {
        type: Schema.Types.ObjectId,
        ref: "car",
      },
      // is available for rent 
      isRequesteAccepted: {
        type: Boolean,
        default: false,
      },
    },
  ],

  // cars that are requested for rent and the owner
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
