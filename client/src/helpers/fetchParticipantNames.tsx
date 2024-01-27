import { useConversationStore } from "../stores/useConversationStore";
import { createNewCachedParticipant } from "./createNewCachedParticipant";
import { BASEURL } from "../main";
import { User } from "../types/User";
export const fetchParticipantNames = async (participant: string) => {
	const { cachedParticipants } = useConversationStore.getState();
	if (
		// Check if the participant is already in the cachedParticipants
		cachedParticipants.some(
			(cachedParticipant) => cachedParticipant.userID === participant
		)
	) {
		console.log("Participant is cached, skipping fetch");
		return;
	}
	try {
		const response = await fetch(`${BASEURL}/user/${participant}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});

		if (response.ok) {
			const data = (await response.json()) as User;
			createNewCachedParticipant(
				participant.toString(),
				data.username.toString()
			);
		}
	} catch (error: any) {
		console.log(error);
	}
};
