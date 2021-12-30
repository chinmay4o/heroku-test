import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { Customers } from "./models/bhima/customerSchema.js";

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

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(url , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`mongodb connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

app.get("/", (req, res) => {
  res.send("api is running");
});

app.get("/customers", async (req, res) => {
  try {
    const data = await Customers.find();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.listen(process.env.PORT, () =>
  console.log("listening on port " + process.env.PORT)
);


