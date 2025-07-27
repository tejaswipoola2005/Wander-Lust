const { ref } = require("joi");
let mongoose=require("mongoose");
const Review=require("./review.js")
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
country:String,
reviews:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }
]
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }  
})

let Listing=new mongoose.model("Listing",listingSchema);
module.exports=Listing;