import { Conversation } from "../../../../types/Conversation";
type ConversationsProps = {
	conversations: Conversation[];
	handleConversationClick: (conversation: Conversation) => void;
};
const Conversations = ({
	conversations,
	handleConversationClick,
}: ConversationsProps) => {
	return (
		<>
			{conversations.map((conversation: Conversation, index) => (
				<div className="singleConversationContainer" key={index}>
					<p
						className="conversationTitle"
						onClick={() => handleConversationClick(conversation)}
					>
						{conversation.conversationTitle}
					</p>
				</div>
			))}
		</>
	);
};

export default Conversations;
