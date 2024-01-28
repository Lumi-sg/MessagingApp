import { useUIStore } from "../../../stores/useUIStore";
import "./modal.css";
import { useUserStore } from "../../../stores/userStore";
import { useState } from "react";
import { BASEURL } from "../../../main";
import { fetchUserConversations } from "../../../helpers/fetchUserConversations";

const AddConversationModal = () => {
	const { setShowModal } = useUIStore();
	const { user, allUsers } = useUserStore();
	const [responseError, setResponseError] = useState("");
	const [newConversationTitle, setNewConversationTitle] = useState("");
	const [recipientID, setRecipientID] = useState("");

	const handleAddConversationSubmit = async () => {
		event?.preventDefault();
		try {
			const response = await fetch(`${BASEURL}/createconversation`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					conversationTitle: newConversationTitle,
					senderUserID: user?._id,
					receiverUserID: recipientID,
				}),
			});
			if (response.ok) {
				console.log("Conversation created successfully");
				fetchUserConversations();
				fetchUserConversations();
				closeModal();
			}
		} catch (error: any) {
			console.error("Error creating conversation", error);
			setResponseError(error.toString());
		}
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
				value={recipientID}
				onChange={(e) => setRecipientID(e.target.value)}
			>
				<option>Select Recipient</option>
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
