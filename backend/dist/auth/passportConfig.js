"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const User_1 = require("../models/User");
const Password_1 = require("../models/Password");
passport_1.default.use(new passport_local_1.Strategy(async (username, password, done) => {
    try {
        const user = await User_1.User.findOne({ username });
        if (!user) {
            return done(null, false, { message: "Incorrect username." });
        }
        const userID = user._id;
        const userPasswordObject = await Password_1.Password.findOne({ userID: userID });
        if (!userPasswordObject) {
            return;
        }
        const match = await bcryptjs_1.default.compare(password, userPasswordObject.password);
        if (!match) {
            return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
//# sourceMappingURL=passportConfig.js.map