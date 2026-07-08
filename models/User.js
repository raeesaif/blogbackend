import mongoose from "mongoose";




const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["reader","admin","writer"],
        default:"reader"
    },
   isActive: {
      type: Boolean,
      default: true
    },
    profileImage: {
      type: String,
      default: null
    },
    profileImageId: {
      type: String,
      default: null
    }
   
},
{
    timestamps: true // createdAt & updatedAt
  }
)

const userModel = mongoose.model("users", userSchema);

export default userModel;