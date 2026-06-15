const monogoose = require('mongoose');
const Listing = require('../models/listing.js');
const initdata =require('./data.js');

const mango_url="mongodb://127.0.0.1:27017/wnaderlust";
main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});
async function main() {
    await monogoose.connect(mango_url);
}
const init=async()=>{
    await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj)=>({ ...obj, owner: "6a1c3eb3c578d8550cac6c0b" })); // Assuming you have a user ID
    await Listing.insertMany(initdata.data);
    console.log("Database initialized with sample data");
}
init();