import mongoose, { Document, Schema, Types } from "mongoose";
// import { MessageType } from "./Message";
import { UserType } from "./User";
export type MessageType = {
	sender: UserType;
	content: string;
	timestamp: Date;
};
export type ConversationType = Document & {
	conversationTitle: string;
	participants: UserType[];
	messages: MessageType[];
};

const conversationSchema = new Schema<ConversationType>({
	conversationTitle: {
		type: String,
		required: true,
		maxlength: 50,
		minlength: 1,
	},
	participants: [{ type: Types.ObjectId, ref: "User", required: true }],
	messages: [{ type: Object, required: true }],
});

export const Conversation = mongoose.model<ConversationType>(
	"Conversation",
	conversationSchema
);

export default Conversation;
