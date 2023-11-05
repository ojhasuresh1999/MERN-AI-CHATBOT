import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model.js";
import { compare, hash } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ errorCode: 0, result: users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ errorCode: 1, message: error.message });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) return res.status(401).send("User Already Exist");
    const hashedPassword = await hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    //! Create Token and store cookie 👇👇👇

    res.clearCookie(COOKIE_NAME, {
      domain: "localhost",
      httpOnly: true,
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires: expires,
      httpOnly: true,
      signed: true,
    });

    res.status(201).json({ errorCode: 0, name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).send({ errorCode: 1, message: error.message });
  }
};

export const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) return res.status(401).send("User is not exist");
    const isPaswwordCorrect = await compare(password, user.password);
    if (!isPaswwordCorrect)
      return res.status(401).send("Incorrect Password 😒😒😒");

    //! Create Token and store cookie 👇👇👇

    res.clearCookie(COOKIE_NAME, {
      domain: "localhost",
      httpOnly: true,
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires: expires,
      httpOnly: true,
      signed: true,
    });
    res.status(201).json({ errorCode: 0, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).send({ errorCode: 1, message: error.message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
