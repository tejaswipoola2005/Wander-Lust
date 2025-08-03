const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {validateListing,isLoggedIn,isOwner}=require("../middleware.js")
const listingController=require("../controllers/listings.js")
const multer  = require('multer')

const {storage}=require("../cloudConfig.js")

const upload = multer({storage})

router
.route("/")
//index route
.get(wrapAsync(listingController.index))
//create route
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm)


router
.route("/:id")
//show route
.get(wrapAsync(listingController.showListing))
//update route
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
//delete route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//edit request route - to render a form
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;