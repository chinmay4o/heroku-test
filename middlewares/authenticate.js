import jwt from "jsonwebtoken";
import { Users } from "../models/bhima/userSchema.js";

const authenticate = async (req, res, next) => {
  const { token } = req.body;

  if(!token) {
    res.status(401).json({message : "Unauthorized:No token provided"});
  }

  try {
    const verifyToken = await jwt.verify(token, process.env.SECRET);

    if(!verifyToken) {
        throw new Error ("token not found");
    }

    const rootUser = await Users.findOne({ _id: verifyToken._id , "tokens.token" : token });

    if (!rootUser) {
        throw new Error("User not Found");
      }
      req.token = token;
      req.rootUser = rootUser;
      req.userID = rootUser._id;
      // throw new Error('User not Found');
      return next();  
  } catch (error) {
    res.status(401).json({message : "Unauthorized:No token provided"});
    console.log(error);
  }
};


export { authenticate };