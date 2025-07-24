const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

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
const initdb=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data is initialized");
}
initdb();