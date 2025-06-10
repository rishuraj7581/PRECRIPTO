// adminController.js
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

// API for admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      return res.json({
        success: false,
        message: "plz enter correct credentials",
      });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;
    //checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "missing details " });
    }
    // validating email formate
    if (validator.isEmail(email) === false) {
      return res.json({ success: false, message: "invalid email" });
    }
    // validating password formate
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "password should be at least 8 characters and strong",
      });
    }
    //hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //here 10 round means ?
    // 10 rounds means the hashing algorithm will perform 2^10 (or 1024) iterations of the hashing function, making it more computationally expensive and time-consuming to crack the password.

    // uploading image to cloudinary
    const imageUplaod = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUplaod.secure_url;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      specialization,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      image: imageUrl,
      date: Date.now(),
    };
    // saving doctor data to database
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({
      success: true,
      message: "Doctor added successfully",
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error adding doctor" });
  }
};
