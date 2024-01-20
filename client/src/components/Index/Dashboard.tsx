import { useUserStore } from "../../stores/userStore";
import { useRouteLoaderData } from "react-router-dom";
import "./dashboard.css";
import { Conversation } from "../../types/Conversation";

const Dashboard = () => {
	const { user } = useUserStore();
	const conversations = useRouteLoaderData("conversations") as Conversation[];
	console.table(conversations);

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
						<p className="conversationTitle">
							{conversation.conversationTitle}
						</p>
						<p className="participants">
							{conversation.participants.map((participant) => (
								<span>{participant.username}</span>
							))}
						</p>
					</div>
				))}
			</div>
			<div className="conversationContainer">
				<div className="conversationtopRowContainer"></div>
			</div>
		</div>
	);
};

export default Dashboard;
