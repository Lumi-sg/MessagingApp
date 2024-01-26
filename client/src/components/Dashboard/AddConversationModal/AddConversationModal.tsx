import { useUIStore } from "../../../stores/useUIStore";
import "./modal.css";
import { useUserStore } from "../../../stores/userStore";

const AddConversationModal = () => {
	const { setShowModal } = useUIStore();
	const { user, allUsers } = useUserStore();

    const handleAddConversationSubmit = () => {
        // TODO
        setShowModal(false);
    }

	return (
		<form className="addConversationModalContainer">
			<label htmlFor="convoTitle"> Conversation Title: </label>
			<input type="text" className="convoTitle" />
			<label htmlFor="recipient"> Recipient: </label>
			<select name="recipient" className="recipient">
				{allUsers!.map(
					(fetchedUser) =>
						fetchedUser.username !== user?.username && (
							<option
								key={fetchedUser._id}
								value={fetchedUser._id}
							>
								{fetchedUser.username}
							</option>
						)
				)}
			</select>

			<button onClick={handleAddConversationSubmit}>Submit</button>
		</form>
	);
};

export default AddConversationModal;
