const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  item_url: {
    type: String,
  },
  title: {
    type: String,
  },
  price: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: String,
  },
});

module.exports = mongoose.model('posts', postSchema);
