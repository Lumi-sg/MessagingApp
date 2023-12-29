import mongoose, { Document, Schema, Types } from "mongoose";

export type UserType = Document & {
	name: string;
	password: string;
	friends: UserType[];
	statusMessage: string;
	age: number;
	country: string;
};

const userSchema = new Schema<UserType>({
	name: {
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 15,
	},
	password: { type: String, required: true, minlength: 5, maxlength: 20 },
	friends: [{ type: Types.ObjectId, ref: "User" }],
	statusMessage: { type: String, maxlength: 50 },
	age: { type: Number, min: 13, max: 100, required: true },
	country: { type: String, required: true },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
