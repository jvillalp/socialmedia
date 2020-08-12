const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// mongoose.connect(db);
const connectDB = async () => {
    try {
        mongoose.connect(db, {
            //DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
            useNewUrlParser: true,
            ///DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option
            useUnifiedTopology: true
        });

        console.log("MongoDB Connected...")
    } catch (err) {
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB