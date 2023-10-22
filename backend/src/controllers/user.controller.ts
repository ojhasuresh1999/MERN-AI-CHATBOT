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
    const user = await UserModel.create({
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
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      signed: true,
    });

    res.status(201).json({ errorCode: 0, result: user });
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
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      signed: true,
    });
    res
      .status(201)
      .json({ errorCode: 0, result: "Log In Successfully 👌👌👌" });
  } catch (error) {
    res.status(500).send({ errorCode: 1, message: error.message });
  }
};
