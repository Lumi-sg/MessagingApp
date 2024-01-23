import { useUserStore } from "../../stores/userStore";
import { useConversationStore } from "../../stores/useConversationStore";
import { useRouteLoaderData } from "react-router-dom";
import "./dashboard.css";
import { Conversation, Message } from "../../types/Conversation";
import { BASEURL } from "../../main";
import { User } from "../../types/User";

const Dashboard = () => {
	const { user } = useUserStore();
	const {
		currentConversation,
		setCurrentConversation,
		cachedParticipants,
		setCachedParticipants,
	} = useConversationStore();
	const conversations = useRouteLoaderData("conversations") as Conversation[];

	const handleConversationClick = (conversation: Conversation) => {
		setCurrentConversation(conversation);
		conversation.participants.forEach((participant) => {
			fetchParticipantNames(participant as string);
		});
	};

	const fetchParticipantNames = async (participant: String) => {
		try {
			const response = await fetch(`${BASEURL}/user/${participant}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (response.ok) {
				const data = (await response.json()) as User;
				createNewParticipant(
					participant.toString(),
					data.username.toString()
				);
			}
		} catch (error: any) {
			console.log(error);
		}
	};

	const createNewParticipant = (userID: string, username: string) => {
		const newUser = {
			userID,
			username,
		};

		const participantExists = cachedParticipants.some(
			(participant) =>
				participant.userID === newUser.userID &&
				participant.username === newUser.username
		);

		if (participantExists) {
			return;
		}

		const updatedParticipants = [...cachedParticipants, newUser];
		console.table(updatedParticipants);
		setCachedParticipants(updatedParticipants);
	};

	const getUsername = (participantID: string): string | undefined => {
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
					<p className="conversationParticipantsLength">{`Participants: ${currentConversation?.participants.length}`}</p>
					<div className="conversationParticipantsNames">
						{currentConversation?.participants.map(
							(participantID, index) => (
								<span key={index}>
									{getUsername(participantID.toString()) ||
										"Unknown User"}
								</span>
							)
						)}
					</div>
				</div>
				<div className="conversationContentContainer">
					{currentConversation?.messages.map(
						(message: Message, index) => (
							<p className="message" key={index}>
								{message.content}
							</p>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
