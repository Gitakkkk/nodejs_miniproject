const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: String, 
  itemId: String, 
  nickname: String,
  
  
  
});
CommentSchema.virtual("CommentId").get(function () {
  return this._id.toHexString();
});
CommentSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Comment", CommentSchema);