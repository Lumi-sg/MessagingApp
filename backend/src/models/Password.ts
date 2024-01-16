import mongoose, { Document, Schema, Types } from "mongoose";
import { UserType } from "./User";

export type PasswordType = Document & {
	_id?: Types.ObjectId;
	password: string;
	userID: UserType["_id"];
};

const passwordSchema = new Schema<PasswordType>({
	password: { type: String, required: true },
	userID: { type: Types.ObjectId, ref: "User", required: true },
});

export const Password = mongoose.model<PasswordType>(
	"Password",
	passwordSchema
);
export default Password;
