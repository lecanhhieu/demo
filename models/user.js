const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      }
});
//DKm deo hieu luon

UserSchema.methods.comparePass = function(candidatePassword, cb) {
  console.log('candidatePassword >>>', candidatePassword, 'this.pass' , this.password)
  cb(true); 
}
//hieu roi. phai dung arrow function
// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//   console.log('candidatePassword >>>', candidatePassword)
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//       if (err) return cb(err);
//       cb(null, isMatch);
//   });
// };


const User = module.exports = mongoose.model('User', UserSchema);