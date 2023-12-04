const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const subscriber = new mongoose.Schema({
    _id: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscriber', subscriber);
