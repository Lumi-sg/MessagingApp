import { create } from "zustand";
import { devtools } from "zustand/middleware";

type UIstate = {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
};

export const useUIStore = create<UIstate>()(
	devtools((set) => ({
		showModal: false,
		setShowModal: (showModal) => set({ showModal }, false, "setShowModal"),
	}))
);
