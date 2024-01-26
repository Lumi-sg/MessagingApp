import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User as UserType } from "../types/User";

type Userstate = {
	user: UserType | null;
	setUser: (user: UserType) => void;
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
	login: (response: Response) => Promise<void>;
	logout: () => void;
};

export const useUserStore = create<Userstate>()(
	persist(
		devtools((set) => ({
			user: null,
			setUser: (user) => set({ user }, false, "setUser"),
			isLoggedIn: false,
			setIsLoggedIn: (isLoggedIn) =>
				set({ isLoggedIn }, false, "setIsLoggedIn"),
			logout: () => {
				localStorage.removeItem("token");
				set({ user: null, isLoggedIn: false }, false, "logout");
			},
			login: async (response: any) => {
				const data = await response.json();
				localStorage.setItem("token", data.token);
				const userResponse = data.user as UserType;

				// Set user and isLoggedIn
				set(
					{ user: userResponse, isLoggedIn: true },
					false,
					"saveLoginData"
				);
			},
		})),
		{ name: "userStore" }
	)
);
