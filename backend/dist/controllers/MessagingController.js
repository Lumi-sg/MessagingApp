"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_message = exports.edit_conversation_title = exports.leave_conversation = exports.create_conversation = exports.get_conversations = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const Conversation_1 = require("../models/Conversation");
exports.get_conversations = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        if (!req.user) {
            return;
        }
        const user = await User_1.User.findById(req.user.userId).select("-password");
        if (!user) {
            console.log("User not found");
            res.status(404).send("User not found");
            return;
        }
        const conversations = await Conversation_1.Conversation.find({
            participants: user._id,
        });
        console.log(`Found ${conversations.length} conversations`);
        res.status(200).json(conversations);
    }
    catch (error) {
        console.error("Error getting conversations", error);
        res.status(500).send(`Error getting  conversations: ${error.message}`);
    }
});
exports.create_conversation = [
    (0, express_validator_1.body)("conversationTitle")
        .trim()
        .notEmpty()
        .withMessage("Please enter a conversation title")
        .isLength({ max: 50 })
        .withMessage("Conversation title must be 50 characters or less")
        .isLength({ min: 1 })
        .withMessage("Conversation title must be at least 1 character long"),
    (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const { conversationTitle, senderUserID, receiverUserID } = req.body;
            if (!errors.isEmpty()) {
                console.log("Validation errors", errors.array());
                res.status(400).send(errors);
                return;
            }
            if (!senderUserID || !receiverUserID) {
                console.log("senderUserID or receiverUserID not provided");
                res.status(400).send("senderUserID or receiverUserID not provided");
                return;
            }
            if (senderUserID === receiverUserID) {
                console.log("senderUserID and receiverUserID must be different");
                res.status(400).send("senderUserID and receiverUserID must be different");
                return;
            }
            try {
                const sender = await User_1.User.findById(senderUserID).select("-password");
                const receiver = await User_1.User.findById(receiverUserID).select("-password");
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
                const conversation = new Conversation_1.Conversation({
                    conversationTitle,
                    participants: [sender, receiver],
                    messages: [],
                });
                await conversation.save();
                console.log(`Conversation with participants ${sender.username} and ${receiver.username}created with ID ${conversation._id}`);
                res.status(201).send("Conversation created");
            }
            catch (error) {
                console.error("Error identifying sender and receiver", error);
                res.status(500).send(`Error identifying sender and receiver: ${error.message}`);
                return;
            }
        }
        catch (error) {
            console.error("Error creating conversation", error);
            res.status(500).send(`Error creating conversation: ${error.message}`);
            return;
        }
    }),
];
exports.leave_conversation = (0, express_async_handler_1.default)(async (req, res) => {
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
        const user = await User_1.User.findById(userID).select("-password");
        if (!user) {
            console.log("User not found");
            res.status(404).send("User not found");
            return;
        }
        await Conversation_1.Conversation.findByIdAndUpdate(conversationID, { $pull: { participants: user._id } }, { new: true });
        console.log(`User ${user} removed from conversation`);
        res.status(200).send(`User ${user} removed from conversation`);
    }
    catch (error) {
        console.error("Error deleting conversation", error);
        res.status(500).send(`Error deleting conversation: ${error.message}`);
    }
});
exports.edit_conversation_title = [
    (0, express_validator_1.body)("conversationTitle")
        .trim()
        .notEmpty()
        .withMessage("Please enter a conversation title")
        .isLength({ max: 50 })
        .withMessage("Conversation title must be 50 characters or less")
        .isLength({ min: 1 })
        .withMessage("Conversation title must be at least 1 character long"),
    (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const { conversationID, userID, conversationTitle } = req.body;
            if (!errors.isEmpty()) {
                console.log("Validation errors", errors.array());
                res.status(400).send(errors);
                return;
            }
            if (!conversationID) {
                console.log("Conversation not provided");
                res.status(404).send("Conversation not provided");
                return;
            }
            if (!userID) {
                console.log("User not provided");
                res.status(404).send("User not provided");
                return;
            }
            const user = await User_1.User.findById(userID).select("-password");
            if (!user) {
                console.log("User not found");
                res.status(404).send("User not found");
                return;
            }
            const conversation = await Conversation_1.Conversation.findById(conversationID);
            if (!conversation) {
                console.log("Conversation not found");
                res.status(404).send("Conversation not found");
                return;
            }
            if (conversation.participants.includes(user._id)) {
                conversation.conversationTitle = conversationTitle;
                await conversation.save();
                res.status(200).send("Conversation title edited");
            }
            else {
                console.log("User not a participant of the conversation");
                res.status(400).send("User not a participant of the conversation");
            }
        }
        catch (error) {
            console.error("Error editting conversation title", error);
            res.status(500).send(`Error editting conversation title: ${error.message}`);
        }
    }),
];
exports.create_message = [
    (0, express_validator_1.body)("content")
        .trim()
        .notEmpty()
        .withMessage("Please enter a message")
        .isLength({ max: 500 })
        .withMessage("Message must be 500 characters or less")
        .isLength({ min: 1 })
        .withMessage("Message must be at least 1 character long"),
    (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const { conversationID, userID, content } = req.body;
            if (!errors.isEmpty()) {
                console.log("Validation errors", errors.array());
                res.status(400).send(errors);
                return;
            }
            if (!conversationID) {
                console.log("Conversation not provided");
                res.status(404).send("Conversation not provided");
                return;
            }
            if (!userID) {
                console.log("User not provided");
                res.status(404).send("User not provided");
                return;
            }
            const user = await User_1.User.findById(userID);
            if (!user) {
                console.log("User not found");
                res.status(404).send("User not found");
                return;
            }
            const conversation = await Conversation_1.Conversation.findById(conversationID);
            if (!conversation) {
                console.log("Conversation not found");
                res.status(404).send("Conversation not found");
                return;
            }
            if (!conversation.participants.includes(user._id)) {
                console.log("User not a participant of the conversation");
                res.status(400).send("User not a participant of the conversation");
                return;
            }
            const message = {
                sender: user,
                content: content,
                timestamp: new Date(),
            };
            conversation.messages.push(message);
            await conversation.save();
            res.status(200).send("Message created");
        }
        catch (error) {
            console.error("Error creating message", error);
            res.status(500).send(`Error creating message: ${error.message}`);
        }
    }),
];
//# sourceMappingURL=MessagingController.js.map