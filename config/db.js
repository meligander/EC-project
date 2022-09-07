const mongoose = require("mongoose");

const connectDB = async () => {
   try {
      await mongoose.connect(
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
            } else {
               console.log("MongoDB connected");
            }
         }
      );
   } catch (err) {
      console.error(err.message);
      process.exit(1);
   }
};

module.exports = connectDB;
