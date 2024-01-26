import { useConversationStore } from "../stores/useConversationStore";
export const getCachedUsername = (
	participantID: string
): string | undefined => {
	const { cachedParticipants } = useConversationStore.getState();
	const matchingParticipant = cachedParticipants.find(
		(cachedParticipant) => cachedParticipant.userID === participantID
	);

	return matchingParticipant?.username;
};
