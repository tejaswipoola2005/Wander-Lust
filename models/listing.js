let mongoose=require("mongoose");
let listingSchema=mongoose.Schema({
title:{
    type:String,
    required:true
},
description:String,
image:{
    type:String,
    default:'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
   // set:(v)=>v===""?'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60':v,
},
price:Number,
location:String,
country:String
})
let Listing=new mongoose.model("Listing",listingSchema);
module.exports=Listing;