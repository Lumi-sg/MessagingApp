import { useUserStore } from "../../stores/userStore";
import { useConversationStore } from "../../stores/useConversationStore";
import { useRouteLoaderData } from "react-router-dom";
import "./dashboard.css";
import { Conversation, Message } from "../../types/Conversation";
import { fetchParticipantNames } from "../../helpers/fetchParticipantNames";
import { useEffect, useRef, useState } from "react";
import { getCachedUsername } from "../../helpers/getCachedUsername";
import MessageElement from "./Message/MessageElement";
import MessageInput from "./MessageInput/MessageInput";
import Sidebar from "./Sidebar/Sidebar";
import AddConversationModal from "./AddConversationModal/AddConversationModal";
import { useUIStore } from "../../stores/useUIStore";
import { fetchConversationsParticipants } from "./Sidebar/Conversations/Conversations";
import { deleteConversation } from "../../helpers/deleteConversation";

const Dashboard = () => {
	const { user } = useUserStore();
	const {
		currentConversation,
		setCurrentConversation,
		allConversations,
		setAllConversations,
	} = useConversationStore();
	const conversations = useRouteLoaderData("conversations") as Conversation[];
	const [isConversationOpen, setisConversationOpen] = useState(false);
	const scrollToBottom = useRef<HTMLDivElement>(null);
	const { showModal } = useUIStore();

	useEffect(() => {
		if (conversations) {
			setAllConversations(conversations);
			fetchConversationsParticipants(conversations);
		}
	}, []);

	useEffect(() => {
		const refreshedConversation = allConversations.find(
			(conversation) =>
				conversation._id === currentConversation?._id
		)
		if (refreshedConversation) {
			handleConversationClick(refreshedConversation);
		}
	},[allConversations])

	const handleConversationClick = async (conversation: Conversation) => {
		setisConversationOpen(true);
		setCurrentConversation(conversation);
		await Promise.all(
			conversation.participants.map((participant) =>
				fetchParticipantNames(participant as string)
			)
		);

		if (scrollToBottom.current) {
			scrollToBottom.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleDeleteConversation = async () => {
		deleteConversation(currentConversation!._id as string);
	};

	return (
		<div className="dashboardContainer">
			<Sidebar
				conversations={allConversations}
				handleConversationClick={handleConversationClick}
			/>
			<div className="conversationContainer">
				<div className="conversationtopRowContainer">
					<p className="conversationTitle">
						{currentConversation?.conversationTitle}
					</p>

					<div className="conversationParticipantsNames">
						{currentConversation?.participants.map(
							(participantID, index) => (
								<span key={index}>
									{getCachedUsername(
										participantID.toString()
									) || "Unknown User"}
								</span>
							)
						)}
					</div>
					{currentConversation && (
						<button onClick={handleDeleteConversation}>
							Delete
						</button>
					)}
				</div>
				<div className="conversationContentContainer">
					{currentConversation?.messages.map(
						(message: Message, index) => (
							<MessageElement
								index={index}
								message={message}
								username={user!.username}
							/>
						)
					)}
					<div className="scrollToBottom" ref={scrollToBottom}></div>
				</div>
				{isConversationOpen && <MessageInput />}
			</div>
			{showModal && <AddConversationModal />}
		</div>
	);
};

export default Dashboard;
