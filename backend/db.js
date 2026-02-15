const mongoose = require("mongoose");
const { string } = require("zod");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
const User = new mongoose.Schema({
  username: {
    type: String,
    unique: true,  
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const Complaints = new Schema({
    userId:ObjectId,
    title:String,
    urgent:Boolean,
    hostel:String,
    room_no:String,
    done:Boolean,

})
const UserModel = mongoose.model("users",User);
const ComplaintModel = mongoose.model("complaints",Complaints);
module.exports={
    UserModel,
    ComplaintModel
}