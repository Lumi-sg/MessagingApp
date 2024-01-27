import { Conversation } from "../../../../types/Conversation";
import { fetchParticipantNames } from "../../../../helpers/fetchParticipantNames";
import { useEffect } from "react";
import { getCachedUsername } from "../../../../helpers/getCachedUsername";
type ConversationsProps = {
	conversations: Conversation[];
	handleConversationClick: (conversation: Conversation) => void;
};
const Conversations = ({
	conversations,
	handleConversationClick,
}: ConversationsProps) => {
	useEffect(() => {
		fetchConversationsParticipants(conversations);
	}, []);
	return (
		<div className="sideBarConvosContainer">
			{conversations.map((conversation: Conversation, index) => (
				<div className="singleConversationContainer" key={index}>
					<p
						className="conversationTitle"
						onClick={() => handleConversationClick(conversation)}
					>
						{conversation.conversationTitle}
					</p>
					<div className="conversationParticipantsNames">
						{conversation.participants.map(
							(participantID, index) => (
								<span key={index}>
									{getCachedUsername(
										participantID.toString()
									) || "Unknown User"}
								</span>
							)
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default Conversations;
export function fetchConversationsParticipants(conversations: Conversation[]) {
	try {
		conversations.forEach(async (conversation: Conversation) => {
			await Promise.all(
				conversation.participants.map((participant) =>
					fetchParticipantNames(participant as string)
				)
			);
		});
	} catch (error) {
		console.log(error);
	}
}
