const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    rentedcar : [
        {
            type: Schema.Types.ObjectId,
            ref: "car",
          },
    ]
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);