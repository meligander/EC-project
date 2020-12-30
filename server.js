const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

//Connect to the DB
connectDB();

//Middleware
app.use(express.json({ limit: "50mb", extended: false }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cors());

app.use("/api/user", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/attendance", require("./routes/api/attendance"));
app.use("/api/category", require("./routes/api/category"));
app.use("/api/class", require("./routes/api/class"));
app.use("/api/enrollment", require("./routes/api/enrollment"));
app.use("/api/expence", require("./routes/api/expence"));
app.use("/api/expence-type", require("./routes/api/expenceType"));
app.use("/api/grade", require("./routes/api/grade"));
app.use("/api/grade-type", require("./routes/api/gradeType"));
app.use("/api/installment", require("./routes/api/installment"));
app.use("/api/invoice", require("./routes/api/invoice"));
app.use("/api/neighbourhood", require("./routes/api/neighbourhood"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/register", require("./routes/api/register"));
app.use("/api/town", require("./routes/api/town"));
app.use("/api/penalty", require("./routes/api/penalty"));

const PORT = process.env.PORT || 5000;

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
   // Set static folder
   app.use(express.static("client/build"));

   app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
   });
}

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
