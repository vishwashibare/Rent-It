const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
})

module.exports = mongoose.model("Review",reviewSchema);