const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js")

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",ejsMate);
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
let port=8080;
let mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main().then((res)=>{
    console.log("connected to database successfully");
})
.catch((ERR)=>{
    console.log(ERR);
})

async function main() {
    await mongoose.connect(mongo_url);
}





app.get("/",(req,res)=>{
res.send("You are on the home page")
})

const validateListing=(req,res,next)=>{
  let {error}= listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,result.error)
  }else{
    next();
  }
}


//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find();
    res.render("./listings/index.ejs",{allListings});

}))

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
        const {id}=req.params;
      let deletedlisting= await Listing.findByIdAndDelete(id);
      console.log(deletedlisting);
        res.redirect("/listings");
}))

//create route
app.post("/listings",wrapAsync(async (req,res)=>{

//    const {title,description,image,price,country,location}=req.body;
// we have another easy method that is while taking the input itself make it an obj key like listing[name]
  const newlisting=new Listing(req.body.listing);
   await newlisting.save();
   res.redirect("/listings");

}))

//update route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
      const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`);
    
}))


//show route - for a specific listing to see completely
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    const {id}=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/show.ejs",{listing});
}))

//edit request route - to render a form
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//there is an error in this i am unable to specify all the paths
app.all('',(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});


app.listen(port,()=>{
console.log(`server is listening to port ${port}`);
})