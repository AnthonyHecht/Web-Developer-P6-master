const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Manufacturer: { type: String, required: true },
    Description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    pepper: { type: String, required: true },
    heat: { type: Number, required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);