import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Customers } from "./models/bhima/customerSchema.js";
import { Users } from "./models/bhima/userSchema.js";
import { Recharge } from "./models/bhima/rechargeSchema.js";
import { Contact } from "./models/bhima/contactSchema.js";
import {authenticate} from "./middlewares/authenticate.js";

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
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("api is running");
});

// Get all customers
app.get("/customers", async (req, res) => {
  try {
    const data = await Customers.find();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(422).send(error);
  }
});


// Adding customers to the database
app.post("/data", async (req, res) => {
    const { cname, email, number, address } = req.body;
  
    try {
      const newData = new Customers({
        name: cname,
        email,
        number,
        address,
      });
  
      await newData.save();
  
      res.send(newData);
    } catch (error) {
      console.log(error);
      res.status(422).send(error);
    }
  });

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).send("fill the details first ");
  }
  try {
    const user = await Users.findOne({ email: email });
    if (user) {
      const verifyUser = await bcrypt.compare(password, user.password);
      if (verifyUser) {
        const token = await jwt.sign({ _id: user._id }, process.env.SECRET);
        user.tokens = user.tokens.concat({ token: token });
        await user.save();
        console.log(token);

        res.json({ user, tokenAll: token });
      } else {
        throw new Error("passsword not valid");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(422).send(err);
  }
});

//   adding recharge customers to the database
app.post("/recharge", async (req, res) => {
  const { cname, number } = req.body;

  try {
    const newData = new Recharge({
      name: cname,
      number,
    });

    await newData.save();

    res.send(newData);
  } catch (error) {
    console.log(error);
    res.status(422).send(error);
  }
});

//   sending recharge customers to the database
app.get("/recharge", async (req, res) => {
  try {
    const data = await Recharge.find();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(422).send(error);
  }
});

//   post request for contact form
app.post("/contact", async (req, res) => {
  const { cname, email, number, address } = req.body;

  try {
    const newData = new Contact({
      name: cname,
      email,
      number,
      address,
    });

    await newData.save();

    res.send(newData);
  } catch (error) {
    console.log(error);
    res.status(422).send(error);
  }
});

// dashboard authentication
app.post("/dashboard" , authenticate, async (req, res) => {
  res.send(req.rootUser);
})


app.listen(process.env.PORT, () =>
  console.log("listening on port " + process.env.PORT)
);
