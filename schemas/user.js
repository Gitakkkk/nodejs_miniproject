const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const saltRound = 10;

const UserSchema = new mongoose.Schema({
  nickname: String,
  password: String,
});
UserSchema.virtual('userId').get(function () {
  return this._id.toHexString();
});
UserSchema.set('toJSON', {
  virtuals: true,
});

// UserSchema.pre('save', function (next) {
//   var user = this;
//   if (user.isModified('password')) {
//     bcrypt.genSalt(saltRound, function (err, salt) {
//       if (err) return next(err);

//       bcrypt.hash(user.password, salt, function (err, hash) {
//         if (err) return next(err);
//         user.password = hash;
//         next();
//       });
//     });
//   } else {
//     next();
//   }
// });

// UserSchema.methods.comparePassword = function (plainPassword, cb) {
//   bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
//     if (err) return cb(err), cb(null, isMatch);
//   });
// };

module.exports = mongoose.model('User', UserSchema);
