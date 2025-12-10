const mongoose = require("mongoose");

const s_hour = new mongoose.Schema({
    days: { type: String, required: true },
    open: String,
    close: String,
    isClosed: { type: Boolean, default: false },
});

const s_comment = new mongoose.Schema({
    author: { type: String, required: true },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const s_venue = new mongoose.Schema({
    name: { type: String, required: true, },
    address: String,
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    foodanddrink: [String],
    coordinates: { type: [Number], index: "2dsphere", },
    hours: [s_hour],
    comments: [s_comment],
});

module.exports = mongoose.model("venue", s_venue, "venues");
