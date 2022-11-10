const mongoose = require("mongoose");

const connectDB = () => {
   mongoose.connect(
      process.env.MONGO_URI,
      {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true,
         useFindAndModify: false,
      },
      (err) => {
         if (err) {
            console.error("Failed to connect to MongoDB");
            console.error(err);
            process.exit(1);
         } else {
            console.log("MongoDB connected");
         }
      }
   );
};

module.exports = connectDB;
