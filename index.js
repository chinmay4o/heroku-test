import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

dotenv.config({ path: "./config.env" });

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

const url = process.env.MONGO;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const onn = mongoose.connection;
onn.on("open", () => console.log("mongodb connected"));

app.get("/", (req, res) => {
  res.send("api is running");
});


app.listen(process.env.PORT, () =>
  console.log("listening on port " + process.env.PORT)
);
