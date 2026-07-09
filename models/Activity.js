import mongoose from "mongoose"

const activitySchema = new mongoose.Schema({
    icons:{
        type:String,
        required:true,
        enum:["publish","edit","delete","user","favorite"]
    },
    action:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    }
},
{
    timestamps:true
}
)

const activityModel = mongoose.model("activities",activitySchema)

export default activityModel