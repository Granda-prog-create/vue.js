const mongoose = require('mongoose');
const article = mongoose.model('article', {
    title: String,
    content: String,
    author: String,
    category: String,
    slug: String, 
    publishDate: Date 
});

    module.exports = article; 