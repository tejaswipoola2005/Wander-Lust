const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");


const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error.message);
  }else{
    next();
  }
}

//Reviews
//post review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newReview =new Review(req.body.review)
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
req.flash("success","New Review Created");
res.redirect(`/listings/${listing._id}`)
}));

//Delete review Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
let{id,reviewId}=req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
await Review.findByIdAndDelete(reviewId);
req.flash("success","Review Deleted");
res.redirect(`/listings/${id}`);
}))

module.exports=router;