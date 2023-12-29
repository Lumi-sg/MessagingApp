import mongoose, { Document, Schema, Types } from "mongoose";

export type UserType = Document & {
	name: string;
	password: string;
	friends: UserType[];
	statusMessage?: string;
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
	statusMessage: { type: String },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
