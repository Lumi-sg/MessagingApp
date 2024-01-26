import { Conversation } from "../../../types/Conversation";
import Conversations from "./Conversations/Conversations";
import "../dashboard.css";
import { useUserStore } from "../../../stores/userStore";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
	conversations: Conversation[];
	handleConversationClick: (conversation: Conversation) => void;
};

const Sidebar = ({ conversations, handleConversationClick }: SidebarProps) => {
	const { user } = useUserStore();
	const navigate = useNavigate();

	const handleLogout = () => {
		useUserStore.getState().logout();
		navigate("/login");
	};

	return (
		<div className="sideBarContainer">
			<div className="topRowContainer">
				<button onClick={handleLogout}>Logout</button>
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
