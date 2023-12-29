import mongoose, { Document, Schema, Types } from "mongoose";
import { UserType } from "./User";

export type MessageType = Document & {
	sender: UserType;
	receiver: UserType;
	content: string;
	timestamp: Date;
};

const messageSchema = new Schema<MessageType>({
	sender: { type: Types.ObjectId, ref: "User" },
	receiver: { type: Types.ObjectId, ref: "User" },
	content: { type: String, required: true, minlength: 1, maxlength: 500 },
	timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<MessageType>("Message", messageSchema);

export default Message;
