import { Conversation } from "../../../types/Conversation";
import Conversations from "./Conversations/Conversations";
import "../dashboard.css";
import { useUserStore } from "../../../stores/userStore";

type SidebarProps = {
	conversations: Conversation[];
	handleConversationClick: (conversation: Conversation) => void;
};

const Sidebar = ({ conversations, handleConversationClick }: SidebarProps) => {
	const { user } = useUserStore();

	return (
		<div className="sideBarContainer">
			<div className="topRowContainer">
				<button>Logout</button>
				<h1>{user!.username}</h1>
				<button>+</button>
			</div>
			<Conversations
				conversations={conversations}
				handleConversationClick={handleConversationClick}
			/>
		</div>
	);
};

export default Sidebar;
