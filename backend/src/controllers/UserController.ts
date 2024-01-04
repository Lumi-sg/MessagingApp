import bcrypt from "bcryptjs";
import express from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import passport from "passport";
import { UserType, User } from "../models/User";

export const create_user_post = [
	body("username")
		.trim()
		.isLength({ min: 3, max: 15 })
		.withMessage("Username must be between 3 and 15 characters"),
	body("password")
		.trim()
		.isLength({ min: 5, max: 20 })
		.withMessage("Password must be between 5 and 20 characters"),
	body("age")
		.trim()
		.isInt({ min: 13, max: 100 })
		.withMessage("Age must be between 13 and 100"),
	body("country").trim().isLength({ min: 3, max: 15 }),

	asyncHandler(async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req);
			const { username, password, age, country } = req.body;
			const takenUserName = await User.findOne({ username });

			if (!errors.isEmpty()) {
				console.log("Validation errors", errors.array());
				res.status(400).send(errors);
			} else if (takenUserName) {
				console.log(`Username "${username}" already taken.`);
				res.status(400).send("Username already taken");
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);
				const user = new User({
					username,
					password: hashedPassword,
					age,
					country,
				});
				await user.save();
				res.status(201).send("User created");
			}
		} catch (error: any) {
			console.error("Error creating user", error);
			res.status(500).send(`Error creating user: ${error.message}`);
		}
	}),
];
