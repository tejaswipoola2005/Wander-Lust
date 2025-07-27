const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const Review=require("./models/review.js");

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

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

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

app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)

//there is an error in this i am unable to specify all the paths
app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
});


app.listen(port,()=>{
console.log(`server is listening to port ${port}`);
})