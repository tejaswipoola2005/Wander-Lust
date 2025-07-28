const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js")

const validateListing=(req,res,next)=>{
  let {error}= listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error.message)
  }else{
    next();
  }
}


//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find();
    res.render("./listings/index.ejs",{allListings});

}))

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
        const {id}=req.params;
      let deletedlisting= await Listing.findByIdAndDelete(id);
      req.flash("success","Listing Deleted");
        res.redirect("/listings");
}))

//create route
router.post("/",validateListing,wrapAsync(async (req,res)=>{
//const {title,description,image,price,country,location}=req.body;
// we have another easy method that is while taking the input itself make it an obj key like listing[name]
  const newlisting=new Listing(req.body.listing);
   await newlisting.save();
   req.flash("success","New Listing Created");
   res.redirect("/listings");

}))

//update route
router.put("/:id",wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
      const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
    
}))

//show route - for a specific listing to see completely
router.get("/:id",wrapAsync(async (req,res)=>{
    const {id}=req.params;
   const listing= await Listing.findById(id).populate("reviews");
   if(!listing){
    req.flash("error","Listing you requested for doesnot exist");
    return res.redirect("/listings");
   }
   res.render("listings/show.ejs",{listing});
}))

//edit request route - to render a form
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for doesnot exist");
    return res.redirect("/listings");
   }
    res.render("listings/edit.ejs",{listing});
}));

module.exports=router;