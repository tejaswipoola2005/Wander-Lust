const { required } = require("joi");
let mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
//passport local mongoose automatically saves username and password so 
//need to explicitly define them in the schema.

const userSchema=new Schema({
email:{
    type:String,
    required:true
}
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);