import bcrypt from "bcryptjs";
import express, { response } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import passport from "passport";
import { UserType, User } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Password from "../models/Password";

dotenv.config();

export const create_user_post = [
	body("username")
		.trim()
		.isLength({ min: 3, max: 15 })
		.escape()
		.withMessage("Username must be between 3 and 15 characters"),
	body("password")
		.trim()
		.isLength({ min: 5, max: 20 })
		.escape()
		.withMessage("Password must be between 5 and 20 characters"),
	body("age")
		.trim()
		.isInt({ min: 13, max: 100 })
		.escape()
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
				return;
			}
			if (takenUserName) {
				console.log(`Username "${username}" already taken.`);
				res.status(400).send("Username already taken");
				return;
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = new User({
				username,
				age,
				country,
			});
			const userPassword = new Password({
				password: hashedPassword,
				userID: user._id,
			});

			await user.save();
			await userPassword.save();

			res.status(201).send("User created");
		} catch (error: any) {
			console.error("Error creating user", error);
			res.status(500).send(`Error creating user: ${error.message}`);
		}
	}),
];

export const login_user_post = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	passport.authenticate("local", (err: any, user: any, info: any) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			const errorMessage =
				info && info.message ? info.message : "Unknown error.";
			return res.status(401).send(errorMessage);
		}

		// If authentication is successful, generate a token
		const token = jwt.sign(
			{ userId: user._id, username: user.username },
			`${process.env.SECRET}`,
			{
				expiresIn: "1h",
			}
		);

		// Set the cookie
		res.cookie("jwt", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		});

		// Respond with the generated token or any other user-related data
		return res.status(200).json({ token, user });
	})(req, res, next);
};

export const update_user_status_post = [
	body("statusMessage")
		.trim()
		.isLength({ min: 0, max: 50 })
		.escape()
		.withMessage("Status message must be between 0 and 50 characters"),
	asyncHandler(async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req);
			const { userID, updatedStatusMessage } = req.body;

			if (!errors.isEmpty()) {
				console.log("Validation errors", errors.array());
				res.status(400).send(errors);
				return;
			}

			const user = await User.findById(userID);

			if (!user) {
				res.status(404).send("User not found");
				return;
			}

			user.statusMessage = updatedStatusMessage;
			await user.save();
			res.status(200).send("User status updated");
		} catch (error: any) {
			console.error("Error updating user status", error);
			res.status(500).send(
				`Error updating user status: ${error.message}`
			);
		}
	}),
];

export const logout_user_post = (
	req: express.Request,
	res: express.Response
) => {
	console.log("Entering logout_user_post");

	res.cookie("jwt", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		expires: new Date(0),
	});

	console.log("JWT Cookie cleared");

	res.status(200).send("Logout successful");
};

export const get_single_user = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		try {
			const user = await User.findById(req.params.id);
			if (!user) {
				console.log("User not found");
				res.status(404).send("User not found");
				return;
			}
			console.log(`${user.username} found!`);
			res.status(200).json(user);
		} catch (error: any) {
			console.error("Error getting single user", error);
			res.status(500).send(`Error getting single user: ${error.message}`);
		}
	}
);

export const get_all_users = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		try {
			const users = await User.find().select("-friends");
			res.status(200).json(users);
		} catch (error: any) {
			console.error("Error getting all users", error);
			res.status(500).send(`Error getting all users: ${error.message}`);
		}
	}
);

export const add_friend = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		try {
			const { userID, friendID } = req.body;
			const user = await User.findById(userID);
			const friend = await User.findById(friendID);
			if (!user || !friend) {
				console.log("User or friend not found");
				res.status(404).send("User or friend not found");
				return;
			}
			if (user._id === friend._id) {
				console.log("Cannot add yourself as a friend");
				res.status(400).send("Cannot add yourself as a friend");
				return;
			}
			if (
				user.friends.includes(friendID) ||
				friend.friends.includes(userID)
			) {
				console.log("Already friends");
				res.status(400).send("Already friends");
				return;
			}
			user.friends.push(friendID);
			friend.friends.push(userID);
			await user.save();
			await friend.save();
			res.status(200).send("Friend added");
		} catch (error: any) {
			console.error("Error adding friend", error);
			res.status(500).send(`Error adding friend: ${error.message}`);
		}
	}
);

export const remove_friend = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		try {
			const { userID, friendID } = req.body;
			const user = await User.findById(userID);
			const friend = await User.findById(friendID);
			if (!user || !friend) {
				console.log("User or friend not found");
				res.status(404).send("User or friend not found");
				return;
			}
			if (user._id === friend._id) {
				console.log("Cannot remove yourself as a friend");
				res.status(400).send("Cannot remove yourself as a friend");
				return;
			}
			if (
				!user.friends.includes(friendID) ||
				!friend.friends.includes(userID)
			) {
				console.log("Not friends");
				res.status(400).send("Not friends");
				return;
			}

			user.friends = user.friends.filter((id) => !id.equals(friendID));
			friend.friends = friend.friends.filter((id) => !id.equals(userID));
			try {
				const savedUser = await user.save();
				const savedFriend = await friend.save();
				if (!savedUser || !savedFriend) {
					console.log("Error removing friend");
					res.status(500).send("Error removing friend");
					return;
				}
				res.status(200).send(
					`${friend.username} removed from ${user.username}'s friends list.`
				);
			} catch (error: any) {
				console.error("Error removing friend", error);
				res.status(500).send(`Error removing friend: ${error.message}`);
				return;
			}
		} catch (error: any) {
			console.error("Error removing friend", error);
			res.status(500).send(`Error removing friend: ${error.message}`);
			return;
		}
	}
);

export const get_all_friends = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		try {
			if (!req.user) {
				return;
			}

			const user = await User.findById((req.user as any).userId).select(
				"-password"
			);

			if (!user) {
				console.log("User not found");
				res.status(404).send("User not found");
				return;
			}
			const friends = await User.find({ _id: { $in: user.friends } });
			console.log(`Found ${friends.length} friends`);
			res.status(200).json(friends);
		} catch (error: any) {
			console.error("Error getting all friends", error);
			res.status(500).send(`Error getting all friends: ${error.message}`);
		}
	}
);
