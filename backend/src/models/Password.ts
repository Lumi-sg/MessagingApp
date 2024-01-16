import mongoose, { Document, Schema, Types } from "mongoose";
import { UserType } from "./User";

export type Password = Document & {
	_id?: Types.ObjectId;
	password: string;
	user: UserType;
};

const passwordSchema = new Schema<Password>({
	password: { type: String, required: true },
	user: { type: Types.ObjectId, ref: "User", required: true },
});

export const Password = mongoose.model<Password>("Password", passwordSchema);

export default Password;
