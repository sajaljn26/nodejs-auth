const moongose = require('mongoose');
const connectToDb = async()=>{
    try {
        await moongose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected succesfully")
    } catch (e) {
        console.error('MongoDb connection failed');
        process.exit(1);
    }
}

module.exports = connectToDb;