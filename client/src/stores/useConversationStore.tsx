import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Conversation as ConversationType } from "../types/Conversation";
import { Participant } from "../types/Participant";

type Conversationstate = {
	currentConversation: ConversationType | null;
	setCurrentConversation: (conversation: ConversationType) => void;
	allConversations: ConversationType[];
	setAllConversations: (allConversations: ConversationType[]) => void;
	cachedParticipants: Participant[];
	setCachedParticipants: (currentParticipants: Participant[]) => void;
};

export const useConversationStore = create<Conversationstate>()(
	devtools((set) => ({
		currentConversation: null,
		setCurrentConversation: (currentConversation) =>
			set({ currentConversation }, false, "setCurrentConversation"),
		allConversations: [],
		setAllConversations: (allConversations) =>
			set({ allConversations }, false, "setAllConversations"),
		cachedParticipants: [],
		setCachedParticipants: (currentParticipants) =>
			set(
				{ cachedParticipants: currentParticipants },
				false,
				"setCachedParticipants"
			),
	}))
);
