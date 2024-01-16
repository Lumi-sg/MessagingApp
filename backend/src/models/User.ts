import mongoose, { Document, Schema, Types } from "mongoose";

export type UserType = Document & {
	_id?: Types.ObjectId;
	username: string;
	friends: UserType[];
	statusMessage: string;
	age: number;
	country: string;
};

const userSchema = new Schema<UserType>({
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 15,
	},
	friends: [{ type: Types.ObjectId, ref: "User" }],
	statusMessage: { type: String, maxlength: 50 },
	age: { type: Number, min: 13, max: 100, required: true },
	country: { type: String, required: true },
});

userSchema.virtual("url").get(function () {
	return `/user/${this.username}`;
});

export const User = mongoose.model<UserType>("User", userSchema);

export default User;
