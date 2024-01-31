"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_friends = exports.remove_friend = exports.add_friend = exports.get_all_users = exports.get_single_user = exports.logout_user_post = exports.update_user_status_post = exports.login_user_post = exports.create_user_post = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Password_1 = __importDefault(require("../models/Password"));
dotenv_1.default.config();
exports.create_user_post = [
    (0, express_validator_1.body)("username")
        .trim()
        .isLength({ min: 3, max: 15 })
        .escape()
        .withMessage("Username must be between 3 and 15 characters"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 5, max: 20 })
        .escape()
        .withMessage("Password must be between 5 and 20 characters"),
    (0, express_validator_1.body)("age")
        .trim()
        .isInt({ min: 13, max: 100 })
        .escape()
        .withMessage("Age must be between 13 and 100"),
    (0, express_validator_1.body)("country").trim().isLength({ min: 3, max: 15 }),
    (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const { username, password, age, country } = req.body;
            const takenUserName = await User_1.User.findOne({ username });
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
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = new User_1.User({
                username,
                age,
                country,
            });
            const userPassword = new Password_1.default({
                password: hashedPassword,
                userID: user._id,
            });
            await user.save();
            await userPassword.save();
            res.status(201).send("User created");
        }
        catch (error) {
            console.error("Error creating user", error);
            res.status(500).send(`Error creating user: ${error.message}`);
        }
    }),
];
const login_user_post = (req, res, next) => {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const errorMessage = info && info.message ? info.message : "Unknown error.";
            return res.status(401).send(errorMessage);
        }
        // If authentication is successful, generate a token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username }, `${process.env.SECRET}`, {
            expiresIn: "1h",
        });
        // Set the cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        // Respond with the generated token or any other user-related data
        return res.status(200).json({ token, user });
    })(req, res, next);
};
exports.login_user_post = login_user_post;
exports.update_user_status_post = [
    (0, express_validator_1.body)("statusMessage")
        .trim()
        .isLength({ min: 0, max: 50 })
        .escape()
        .withMessage("Status message must be between 0 and 50 characters"),
    (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const { userID, updatedStatusMessage } = req.body;
            if (!errors.isEmpty()) {
                console.log("Validation errors", errors.array());
                res.status(400).send(errors);
                return;
            }
            const user = await User_1.User.findById(userID);
            if (!user) {
                res.status(404).send("User not found");
                return;
            }
            user.statusMessage = updatedStatusMessage;
            await user.save();
            res.status(200).send("User status updated");
        }
        catch (error) {
            console.error("Error updating user status", error);
            res.status(500).send(`Error updating user status: ${error.message}`);
        }
    }),
];
const logout_user_post = (req, res) => {
    console.log("Entering logout_user_post");
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
    });
    console.log("JWT Cookie cleared");
    res.status(200).send("Logout successful");
};
exports.logout_user_post = logout_user_post;
exports.get_single_user = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const user = await User_1.User.findById(req.params.id);
        if (!user) {
            console.log("User not found");
            res.status(404).send("User not found");
            return;
        }
        console.log(`${user.username} found!`);
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error getting single user", error);
        res.status(500).send(`Error getting single user: ${error.message}`);
    }
});
exports.get_all_users = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const users = await User_1.User.find().select("-friends");
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error getting all users", error);
        res.status(500).send(`Error getting all users: ${error.message}`);
    }
});
exports.add_friend = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { userID, friendID } = req.body;
        const user = await User_1.User.findById(userID);
        const friend = await User_1.User.findById(friendID);
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
        if (user.friends.includes(friendID) ||
            friend.friends.includes(userID)) {
            console.log("Already friends");
            res.status(400).send("Already friends");
            return;
        }
        user.friends.push(friendID);
        friend.friends.push(userID);
        await user.save();
        await friend.save();
        res.status(200).send("Friend added");
    }
    catch (error) {
        console.error("Error adding friend", error);
        res.status(500).send(`Error adding friend: ${error.message}`);
    }
});
exports.remove_friend = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { userID, friendID } = req.body;
        const user = await User_1.User.findById(userID);
        const friend = await User_1.User.findById(friendID);
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
        if (!user.friends.includes(friendID) ||
            !friend.friends.includes(userID)) {
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
            res.status(200).send(`${friend.username} removed from ${user.username}'s friends list.`);
        }
        catch (error) {
            console.error("Error removing friend", error);
            res.status(500).send(`Error removing friend: ${error.message}`);
            return;
        }
    }
    catch (error) {
        console.error("Error removing friend", error);
        res.status(500).send(`Error removing friend: ${error.message}`);
        return;
    }
});
exports.get_all_friends = (0, express_async_handler_1.default)(async (req, res) => {
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
        const friends = await User_1.User.find({ _id: { $in: user.friends } });
        console.log(`Found ${friends.length} friends`);
        res.status(200).json(friends);
    }
    catch (error) {
        console.error("Error getting all friends", error);
        res.status(500).send(`Error getting all friends: ${error.message}`);
    }
});
//# sourceMappingURL=UserController.js.map