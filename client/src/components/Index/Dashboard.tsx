import { useUserStore } from "../../stores/userStore";
import { useConversationStore } from "../../stores/useConversationStore";
import { useRouteLoaderData } from "react-router-dom";
import "./dashboard.css";
import { Conversation, Message } from "../../types/Conversation";
import { BASEURL } from "../../main";
import { User } from "../../types/User";
import { createNewCachedParticipant } from "../../helpers/createNewCachedParticipant";
import { useState } from "react";

const Dashboard = () => {
	const { user } = useUserStore();
	const { currentConversation, setCurrentConversation, cachedParticipants } =
		useConversationStore();
	const conversations = useRouteLoaderData("conversations") as Conversation[];
	const [isConversationOpen, setisConversationOpen] = useState(false);
	const [message, setMessage] = useState("");

	const handleConversationClick = (conversation: Conversation) => {
		setCurrentConversation(conversation);
		conversation.participants.forEach((participant) => {
			fetchParticipantNames(participant as string);
		});
		setisConversationOpen(true);
	};

	const fetchParticipantNames = async (participant: String) => {
		if (
			// Check if the participant is already in the cachedParticipants
			cachedParticipants.some(
				(cachedParticipant) => cachedParticipant.userID === participant
			)
		) {
			console.log("Participant is cached, skipping fetch");
			return;
		}
		try {
			const response = await fetch(`${BASEURL}/user/${participant}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (response.ok) {
				const data = (await response.json()) as User;
				createNewCachedParticipant(
					participant.toString(),
					data.username.toString()
				);
			}
		} catch (error: any) {
			console.log(error);
		}
	};

	const getCachedUsername = (participantID: string): string | undefined => {
		const matchingParticipant = cachedParticipants.find(
			(cachedParticipant) => cachedParticipant.userID === participantID
		);

		return matchingParticipant?.username;
	};

	return (
		<div className="dashboardContainer">
			<div className="sideBarContainer">
				<div className="topRowContainer">
					<button>Logout</button>
					<h1>{user!.username}</h1>
					<button>+</button>
				</div>
				{conversations.map((conversation: Conversation, index) => (
					<div className="singleConversationContainer" key={index}>
						<p
							className="conversationTitle"
							onClick={() =>
								handleConversationClick(conversation)
							}
						>
							{conversation.conversationTitle}
						</p>
					</div>
				))}
			</div>
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
				</div>
				<div className="conversationContentContainer">
					{currentConversation?.messages.map(
						(message: Message, index) => (
							<div className="messageCard">
								<p className="messageUsername">
									{message.sender.username}
								</p>
								<p className="message" key={index}>
									{message.content}
								</p>
								<p className="messageTimestamp">
									{message.timestamp.toString()}
								</p>
							</div>
						)
					)}
				</div>
				{isConversationOpen && (
					<div className="messageInputContainer">
						Your Message Here
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
