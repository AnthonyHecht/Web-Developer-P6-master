const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    _id: { type: String, required: true},
    Name: { type: String, required: true },
    Manufacturer: { type: String, required: true },
    Description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    pepper: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false},
    dislikes: {type: Number, required: false},
    usersLiked: { type: Array, required: false},
    usersDisliked: { type: Array, required: false},
    userId: { type: String, required: true},
});

module.exports = mongoose.model('Sauce', sauceSchema);