const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const postRoute = require("./routes/postRoute.js");
const dalleRoute = require("./routes/dalleRoute.js");
const connectDB = require("./mongodb/connect.js");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.get("/", async (req, res) => {
  res.send("hello world");
});
app.use("/api/v1/post", postRoute);
app.use("/api/v1/dalle", dalleRoute);
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => {
      console.log("server is started on http://localhost:8080");
    });
  } catch (err) {
    console.log(err);
  }
};
startServer();
