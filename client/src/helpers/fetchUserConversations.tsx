import { useConversationStore } from "../stores/useConversationStore";
import { BASEURL } from "../main";

export const fetchUserConversations = async () => {
	try {
		const response = await fetch(`${BASEURL}/conversations`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
        useConversationStore.getState().setAllConversations(await response.json());
	} catch (error) {
		console.error("Error fetching user conversations:", error);
	}
};
