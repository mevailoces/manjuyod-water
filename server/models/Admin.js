const mongoose = require("mongoose");

const adminSchema =
new mongoose.Schema({

name:{
type:String,
required:true,
},

email:{
type:String,
required:true,
unique:true,
},

password:{
type:String,
required:true,
},

createdAt:{
type:Date,
default:Date.now,
},

role: {
  type: String,
  enum: ["admin", "cashier","meterReader"],
  default: "admin",
},

});

module.exports =
mongoose.model(
"Admin",
adminSchema
);
