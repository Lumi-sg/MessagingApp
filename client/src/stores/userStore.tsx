import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User as UserType } from "../types/User";

type Userstate = {
	user: UserType | null;
	setUser: (user: UserType) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const useUserStore = create<Userstate>()(
	devtools((set) => ({
		user: null,
		setUser: (user) => set({ user }),
        isLoggedIn: false,
        setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
	}))
);