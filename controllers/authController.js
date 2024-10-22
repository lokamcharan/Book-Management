const createError = require("../utils/appError");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    //   checking for user
    if (user) {
      res.status(400).json({
        message: "user already exists ",
        status: "failed",
      }); 
      // return next( new createError("user already exist"));
    }
    // password hashing

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // creating user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

   


    // response
    res.status(201).json({
      message: "registered successfully",
      status: "success",
      user:{
        _id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        role:newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // checking user exist or not
    if (!user) {
      res.status(400).json({ message: "user not found", status: "failed" });
      // return next(new createError("user not found", 400));
    }

    // password comparing
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "incorrect password", status: "failed" });
      // return next(new createError("password mismatched", 400));
    }

    // token
    const token = jwt.sign({ _id: user._id,name:user.name,email:user.email,role:user.role }, "secretKey123", {
      expiresIn: "100d",
    });

    // response
    res.status(200).json({
      message: "logged in successfully",
      status: "success",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
