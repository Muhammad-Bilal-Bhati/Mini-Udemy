const mongoose = require('mongoose');


const ConnectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB Connected Successfully for Mini-Udemy!');
    }
    catch(err){
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
}

module.exports = ConnectDB;