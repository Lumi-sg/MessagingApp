import { useConversationStore } from "../stores/useConversationStore";

export const createNewCachedParticipant = (
	userID: string,
	username: string
) => {
	const newUser = {
		userID,
		username,
	};
	const cachedParticipants =
		useConversationStore.getState().cachedParticipants;

	const participantExists = cachedParticipants.some(
		(participant) =>
			participant.userID === newUser.userID &&
			participant.username === newUser.username
	);

	if (participantExists) {
		return;
	}

	const updatedParticipants = [...cachedParticipants, newUser];
	console.table(updatedParticipants);
	useConversationStore.setState({ cachedParticipants: updatedParticipants });
};
