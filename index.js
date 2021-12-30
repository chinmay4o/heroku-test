import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

dotenv.config({path : "./config.env"});

app.use(cors({
    origin: true,
    credentials: true
}));


app.use(express.json());

app.get("/" , (req, res) => {
    res.send("api is running")
});

app.listen(process.env.PORT, () =>
  console.log("listening on port " + process.env.PORT)
);

