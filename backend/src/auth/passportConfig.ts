import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/User";
import { Password } from "../models/Password";

passport.use(
	new LocalStrategy(async (username: any, password: any, done: any) => {
		try {
			const user = await User.findOne({ username });

			if (!user) {
				return done(null, false, { message: "Incorrect username." });
			}
			const userID = user._id;
			const userPasswordObject = await Password.findOne({ userID: userID });
			if (!userPasswordObject) {
				return;
			}
			const match = await bcrypt.compare(
				password,
				userPasswordObject.password
			);

			if (!match) {
				return done(null, false, { message: "Incorrect password." });
			}

			return done(null, user);
		} catch (error) {
			return done(error);
		}
	})
);
