const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const contactSchema = new Schema({
    name : String,
    email : String,
    subject : String,
    message : String,
})

const contact = mongoose.model("contact", contactSchema);
module.exports = contact;