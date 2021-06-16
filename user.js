const mongoose = require('mongoose');
const user = mongoose.model('user', {
    email: String,
    password: String,
    name: String, 
   
});

    module.exports = user; 