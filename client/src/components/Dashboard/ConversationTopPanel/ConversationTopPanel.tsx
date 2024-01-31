import React from "react";
import { Conversation } from "../../../types/Conversation";
import { getCachedUsername } from "../../../helpers/getCachedUsername";
import { deleteConversation } from "../../../helpers/deleteConversation";

type Props = {
	currentConversation: Conversation;
};

const ConversationTopPanel = ({ currentConversation }: Props) => {
	const handleDeleteConversation = async () => {
		deleteConversation(currentConversation!._id as string);
	};
	return (
		<div className="conversationtopRowContainer">
			<p className="conversationTitle">
				{currentConversation?.conversationTitle}
			</p>

			<div className="conversationParticipantsNames">
				{currentConversation?.participants.map(
					(participantID, index) => (
						<span key={index}>
							{getCachedUsername(participantID.toString()) ||
								"Unknown User"}
						</span>
					)
				)}
			</div>
			{currentConversation && (
				<button onClick={handleDeleteConversation}>Delete</button>
			)}
		</div>
	);
};

export default ConversationTopPanel;
