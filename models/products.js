const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

let ProductsSchema = new Schema({
    name: {
        type: String,
        required: true,
      },
      desc: {
        type: String
      }
});

let Products = mongoose.model('products', ProductsSchema);

module.exports = Products;