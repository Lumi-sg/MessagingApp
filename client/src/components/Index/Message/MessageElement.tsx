import { Message } from "../../../types/Conversation";
import { dateFormatter } from "../../../helpers/dateFormatter";

type MessageProps = {
	message: Message;
	username: string;
	index: number;
};

const MessageElement = ({ message, username, index }: MessageProps) => {
	return (
		<div
			className={`messageCard ${
				message.sender.username === username
					? "currentUserMessage"
					: "otherUserMessage"
			}`}
			key={index}
		>
			<p className="messageUsername">{message.sender.username}</p>
			<p className="message">{message.content}</p>
			<p className="messageTimestamp">
				{dateFormatter(message.timestamp.toString())}
			</p>
		</div>
	);
};

export default MessageElement;
