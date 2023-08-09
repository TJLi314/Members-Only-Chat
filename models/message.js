const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema({
    title: { type: String, required: true},
    text: { type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref: "User"},
})

module.exports = mongoose.model("Message", Message);