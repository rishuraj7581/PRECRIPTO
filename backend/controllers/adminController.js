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

// API to add doctor
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
    } = req.body;

    const address = {
      line1: req.body["address[line1]"],
      line2: req.body["address[line2]"],
    };

    const speciality = specialization; // Matching schema field name
    const imageFile = req.file;

    // Check for required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address.line1 ||
      !address.line2 ||
      !imageFile
    ) {
      return res.json({ success: false, message: "missing details" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "invalid email" });
    }

    // Validate password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "password should be at least 8 characters and strong",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // Prepare data
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      image: imageUrl,
      date: Date.now(),
    };

    // Save doctor
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
