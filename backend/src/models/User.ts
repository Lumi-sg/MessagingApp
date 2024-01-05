import mongoose, { Document, Schema, Types } from "mongoose";

export type UserType = Document & {
	_id: Types.ObjectId;
	username: string;
	password: string;
	friends: UserType[];
	statusMessage: string;
	age: number;
	country: string;
};

const userSchema = new Schema<UserType>({
	_id: { type: Types.ObjectId, required: true },
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 15,
	},
	password: { type: String, required: true },
	friends: [{ type: Types.ObjectId, ref: "User" }],
	statusMessage: { type: String, maxlength: 50 },
	age: { type: Number, min: 13, max: 100, required: true },
	country: { type: String, required: true },
});

export const User = mongoose.model<UserType>("User", userSchema);

export default User;
