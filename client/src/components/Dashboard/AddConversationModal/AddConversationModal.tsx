import { useUIStore } from "../../../stores/useUIStore";
import "./modal.css";
import { useUserStore } from "../../../stores/userStore";
import { useState } from "react";
import { useConversationStore } from "../../../stores/useConversationStore";
import { BASEURL } from "../../../main";

const AddConversationModal = () => {
	const { setShowModal } = useUIStore();
	const { user, allUsers } = useUserStore();
	const { currentConversation, setCurrentConversation } =
		useConversationStore();
	const [responseError, setResponseError] = useState("");
	const [newConversationTitle, setNewConversationTitle] = useState("");
	const [recipientID, setRecipientID] = useState("");

	const handleAddConversationSubmit = () => {
		try {
			const createConversationRequest = fetch(`${BASEURL}/createconversation`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
                    conversationTitle: newConversationTitle,
                    senderUser: user?._id,
                    recipientUser: recipientID,
				}),
			});
		} catch (error: any) {
			console.error("Error creating conversation", error);
			setResponseError(error.toString());
		}
		closeModal();
	};

	const closeModal = () => {
		setShowModal(false);
	};

	return (
		<form className="addConversationModalContainer">
			<button className="closeModal" onClick={closeModal}>
				X
			</button>
			<label htmlFor="convoTitle"> Conversation Title: </label>
			<input
				type="text"
				className="convoTitle"
				value={newConversationTitle}
				onChange={(e) => setNewConversationTitle(e.target.value)}
			/>
			<label htmlFor="recipient"> Recipient: </label>
			<select
				name="recipient"
				className="recipient"
				value={newRecipient}
				onChange={(e) => setNewRecipient(e.target.value)}
			>
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
			{responseError && <p>{responseError}</p>}
		</form>
	);
};

export default AddConversationModal;
