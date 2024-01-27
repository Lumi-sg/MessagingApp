import { Conversation } from "../../../types/Conversation";
import Conversations from "./Conversations/Conversations";
import "../dashboard.css";
import { useUserStore } from "../../../stores/userStore";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../../../stores/useUIStore";
import { BASEURL } from "../../../main";
import { User } from "../../../types/User";

type SidebarProps = {
	conversations: Conversation[];
	handleConversationClick: (conversation: Conversation) => void;
};

const Sidebar = ({ conversations, handleConversationClick }: SidebarProps) => {
	const { user, setAllUsers } = useUserStore();
	const navigate = useNavigate();
	const { setShowModal } = useUIStore();

	const handleLogout = () => {
		useUserStore.getState().logout();
		navigate("/login");
	};

	const handleAddConversationClick = () => {
		setShowModal(true);
	};

	return (
		<div className="sideBarContainer">
			<div className="topRowContainer">
				<button onClick={handleLogout}>Logout</button>
				<h1>{user!.username}</h1>
				<button onClick={handleAddConversationClick}>+</button>
			</div>
			<Conversations
				conversations={conversations}
				handleConversationClick={handleConversationClick}
			/>
		</div>
	);
};

export default Sidebar;
