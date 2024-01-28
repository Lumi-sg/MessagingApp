import React from "react";
import { useConversationStore } from "../../../stores/useConversationStore";
import { useUserStore } from "../../../stores/userStore";
import { useState } from "react";
import { BASEURL } from "../../../main";
import { fetchUserConversations } from "../../../helpers/fetchUserConversations";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { currentConversation } = useConversationStore();
	const { user } = useUserStore();

	const handleSubmitKeyboard = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSubmitMessage();
		}
	};

	const handleSubmitMessage = async () => {
		if (message !== "") {
			try {
				const response = await fetch(`${BASEURL}/createmessage`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
					body: JSON.stringify({
						conversationID: currentConversation?._id,
						userID: user?._id,
						content: message,
					}),
				});
				if (!response.ok) {
					console.log("Failed to send message");
					return;
				}
				await fetchUserConversations();
				setMessage("");
			} catch (error) {
				console.log(error);
			}
		}
	};
	return (
		<div className="messageInputContainer">
			<input
				type="text"
				value={message}
				onKeyDown={handleSubmitKeyboard}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type a message"
				className="messageInput"
			/>
			<button className="sendButton" onClick={handleSubmitMessage}>
				Send
			</button>
		</div>
	);
};

export default MessageInput;
