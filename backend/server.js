import express from "express";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyJwt from "./middleware/verifyJwt.js";
import dotenv from "dotenv";
import path from "path";

const app = express();

app.use(express.json());

app.use(cors());

dotenv.config();

app.post("/api/register", async (req, res) => {
  const user = req.body;
  if (!user?.username || !user?.password || !user?.role) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const hashPassword = await bcrypt.hash(user?.password, 10);
  user.password = hashPassword;

  try {
    const newUser = new User(user);
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User Created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = req.body;
  if (!user?.username || !user?.password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  // const hashPassword = await bcrypt.hash(user?.password, 10);
  // user.password = hashPassword;

  try {
    const data = await User.findOne({ username: user?.username });
    console.log(data);
    const match = await bcrypt.compare(user?.password, data?.password);
    console.log(match);
    if (match) {
      const accessToken = jwt.sign(
        {
          username: data?.username,
          role: data?.role,
        },
        "SECTRET",
        {
          expiresIn: "15m",
        }
      );
      res
        .status(201)
        .json({ success: true, message: "Logged In", data: accessToken });
    } else {
      res.status(400).json({ success: false, message: "InValid Password" });
    }
    // const newUser = new User(user);
    // await newUser.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.post("/api/products", async (req, res) => {
  const product = req.body;
  if (!product?.name || !product?.price || !product?.image) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }
  try {
    const newProduct = new Product(product);
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.put("/api/products", async (req, res) => {
  const { id } = req?.query;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product Id" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.delete("/api/products", async (req, res) => {
  const { id } = req?.query;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product Id" });
  }

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product Deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});
