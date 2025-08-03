const Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find();
    res.render("./listings/index.ejs",{allListings});

}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.destroyListing=async(req,res)=>{
        const {id}=req.params;
      let deletedlisting= await Listing.findByIdAndDelete(id);
      req.flash("success","Listing Deleted");
        res.redirect("/listings");
}

module.exports.createListing=async (req,res)=>{
//const {title,description,image,price,country,location}=req.body;
// we have another easy method that is while taking the input itself make it an obj key like listing[name]
let url=req.file.path;
let filename=req.file.filename;
const newlisting=new Listing(req.body.listing);
  newlisting.owner=req.user._id;
  newlisting.image={url,filename};
   await newlisting.save();
   req.flash("success","New Listing Created");
   res.redirect("/listings");

}

module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
      const {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }

    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
    
}

module.exports.showListing=async (req,res)=>{
    const {id}=req.params;
   const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
   if(!listing){
    req.flash("error","Listing you requested for doesnot exist");
    return res.redirect("/listings");
   }
   res.render("listings/show.ejs",{listing});
}



module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for doesnot exist");
    return res.redirect("/listings");
   }
    res.render("listings/edit.ejs",{listing});
}
