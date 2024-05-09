const mongoose = require("mongoose");
const { Schema } = mongoose;


const photoSchema = new Schema({
    image: stgring,
    title: String,
    likes: Array,
    comments: Array,
    userId: mongoose.ObjectId,
    userName: string,
},{
    timestamps: true
})

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;