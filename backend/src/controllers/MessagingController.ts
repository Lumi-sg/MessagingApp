import express, { response } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { UserType, User } from "../models/User";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";

export const get_conversations = asyncHandler(
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
			const conversations = await Conversation.find({
				participants: user._id,
			});
			console.log(`Found ${conversations.length} conversations`);
			res.status(200).json(conversations);
		} catch (error: any) {
			console.error("Error getting conversations", error);
			res.status(500).send(
				`Error getting  conversations: ${error.message}`
			);
		}
	}
);

export const create_conversation = [
	body("conversationTitle")
		.trim()
		.notEmpty()
		.withMessage("Please enter a conversation title")
		.isLength({ max: 50 })
		.withMessage("Conversation title must be 50 characters or less")
		.isLength({ min: 1 })
		.withMessage("Conversation title must be at least 1 character long"),
	asyncHandler(async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req);
			const { conversationTitle, senderUserID, receiverUserID } =
				req.body;
			if (!errors.isEmpty()) {
				console.log("Validation errors", errors.array());
				res.status(400).send(errors);
				return;
			}

			if (!senderUserID || !receiverUserID) {
				console.log("senderUserID or receiverUserID not provided");
				res.status(400).send(
					"senderUserID or receiverUserID not provided"
				);
				return;
			}

			if (senderUserID === receiverUserID) {
				console.log(
					"senderUserID and receiverUserID must be different"
				);
				res.status(400).send(
					"senderUserID and receiverUserID must be different"
				);
				return;
			}
			try {
				const sender = await User.findById(senderUserID);
				const receiver = await User.findById(receiverUserID);

				if (!sender) {
					console.log("Sender not found");
					res.status(404).send("Sender not found");
					return;
				}

				if (!receiver) {
					console.log("Receiver not found");
					res.status(404).send("Receiver not found");
					return;
				}

				const conversation = new Conversation({
					conversationTitle,
					participants: [sender, receiver],
					messages: [],
				});
				await conversation.save();
				console.log(
					`Conversation with participants ${sender.username} and ${receiver.username}created with ID ${conversation._id}`
				);
				res.status(201).send("Conversation created");
			} catch (error: any) {
				console.error("Error identifying sender and receiver", error);
				res.status(500).send(
					`Error identifying sender and receiver: ${error.message}`
				);
				return;
			}
		} catch (error: any) {
			console.error("Error creating conversation", error);
			res.status(500).send(
				`Error creating conversation: ${error.message}`
			);
			return;
		}
	}),
];

export const delete_conversation = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		try {
			const { userID, conversationID } = req.body;
			if (!userID) {
				console.log("User to be removed not provided");
				res.status(400).send("User to be removed not provided");
				return;
			}

			if (!conversationID) {
				console.log("Conversation not found");
				res.status(404).send("Conversation not found");
				return;
			}

			const user = await User.findById(userID).select("-password");
			if (!user) {
				console.log("User not found");
				res.status(404).send("User not found");
				return;
			}

			await Conversation.findByIdAndUpdate(
				conversationID,
				{ $pull: { participants: user } },
				{ new: true }
			);
			res.status(200).send(`User ${user} removed from conversation`);
		} catch (error: any) {
			console.error("Error deleting conversation", error);
			res.status(500).send(
				`Error deleting conversation: ${error.message}`
			);
		}
	}
);
