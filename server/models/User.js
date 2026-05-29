const mongoose = require("mongoose");

const userSchema =
new mongoose.Schema({

  fullName:{
    type:String,
    required:true,
  },

  contactNumber:{
    type:String,
    required:true,
  },

  email:{
    type:String,
    required:true,
    unique:true,
  },

  address:{
    type:String,
    required:true,
  },
landmark: {
  type: String,
},

  connectionType:{
    type:String,
    default:"",
  },

  installationDetails:{
    installationFee:{ type:String, default:"" },
    orNumber:{ type:String, default:"" },
    orDate:{ type:String, default:"" },
    waterMeterMake:{ type:String, default:"" },
    serialNo:{ type:String, default:"" },
    dateTested:{ type:String, default:"" },
    initialReading:{ type:String, default:"" },
    dateInstalled:{ type:String, default:"" },
    installedBy:{ type:String, default:"" },
    remarks:{ type:String, default:"" },
  },

  /* NEW */
  accountNumber:{
    type:String,
    default:"",
  },

  password:{
    type:String,
    required:true,
  },

  profilePicture:{
    type:String,
    default:"",
  },

  validId:{
type:String,
default:"",
},

  applicationStatus:{
    type:String,

    enum:[
      "Pending",
      "Approved",
      "Rejected",
    ],

    default:"Pending",
  },

  billingStatus:{
    type:String,

    enum:[
      "Unpaid",
      "Paid",
    ],

    default:"Unpaid",
  },

  isDeleted: {
  type: Boolean,
  default: false,
},

  role:{
    type:String,

    enum:[
      "user",
      "admin",
    ],

    default:"user",
  },

  createdAt:{
    type:Date,
    default:Date.now,
  },

});

module.exports =
mongoose.model(
  "User",
  userSchema
);
