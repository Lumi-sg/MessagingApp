import React from "react";
import { Conversation } from "../../../types/Conversation";
import { getCachedUsername } from "../../../helpers/getCachedUsername";

type Props = {
	currentConversation: Conversation;
    handleDeleteConversation: () => void;
};

const ConversationTopPanel = ({ currentConversation, handleDeleteConversation }: Props) => {

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
