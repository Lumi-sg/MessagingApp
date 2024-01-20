import { User } from "./User";

export type Message = {
	sender: User;
	content: string;
	timestamp: Date;
};
export type Conversation = {
	_id?: string;
	conversationTitle: string;
	participants: User[];
	messages: Message[];
};
