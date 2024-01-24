import { useUserStore } from "../../stores/userStore";
import { useConversationStore } from "../../stores/useConversationStore";
import { useRouteLoaderData } from "react-router-dom";
import "./dashboard.css";
import { Conversation, Message } from "../../types/Conversation";
import { BASEURL } from "../../main";
import { User } from "../../types/User";
import { createNewCachedParticipant } from "../../helpers/createNewCachedParticipant";
import { dateFormatter } from "../../helpers/dateFormatter";
import { useRef, useState } from "react";

const Dashboard = () => {
	const { user } = useUserStore();
	const { currentConversation, setCurrentConversation, cachedParticipants } =
		useConversationStore();
	const conversations = useRouteLoaderData("conversations") as Conversation[];
	const [isConversationOpen, setisConversationOpen] = useState(false);
	const [message, setMessage] = useState("");
	const contentContainerRef = useRef<HTMLDivElement>(null);

	const handleConversationClick = async (conversation: Conversation) => {
		setisConversationOpen(true);
		setCurrentConversation(conversation);
		await Promise.all(
			conversation.participants.map((participant) =>
				fetchParticipantNames(participant as string)
			)
		);

		if (contentContainerRef.current) {
			contentContainerRef.current.scrollTop =
				contentContainerRef.current.scrollHeight;
		}
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
				<div
					className="conversationContentContainer"
					ref={contentContainerRef}
				>
					{currentConversation?.messages.map(
						(message: Message, index) => (
							<div
								className={`messageCard ${
									message.sender.username === user!.username
										? "currentUserMessage"
										: "otherUserMessage"
								}`}
								key={index}
							>
								<p className="messageUsername">
									{message.sender.username}
								</p>
								<p className="message" key={index}>
									{message.content}
								</p>
								<p className="messageTimestamp">
									{dateFormatter(
										message.timestamp.toString()
									)}
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
