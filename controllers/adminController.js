const Admin = require("../models/adminModel");
const { createToken } = require("../utils/jwt");
const bcrypt = require("bcryptjs");

//admin register
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "admin already exists." });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: createToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: createToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get admin profile
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");

    res.json({
      success: true,
      data: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: "admin",
        lastLogin: admin.lastLogin,
        joinedDate: admin.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { name, email, phone },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: "admin",
        lastLogin: admin.lastLogin,
        joinedDate: admin.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current Password is incorrect",
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: "Password change successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  changePassword,
};
