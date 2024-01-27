import { BASEURL } from "../main";
import { fetchUserConversations } from "../helpers/fetchUserConversations";
import { useUserStore } from "../stores/userStore";
import { useConversationStore } from "../stores/useConversationStore";

export const deleteConversation = async (conversationID: string) => {
    const user = useUserStore.getState().user
   
	try {
		const response = await fetch(`${BASEURL}/leaveconversation`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({
                userID: user?._id,
                conversationID: conversationID
             }),
		});
		if (!response.ok) {
			console.log("Failed to delete conversation");
			return;
		}
		fetchUserConversations();
        useConversationStore.setState({ currentConversation: null });
	} catch (error) {
		console.error("Error deleting conversation:", error);
	}
};
