import React from "react";
import ReactDOM from "react-dom/client";
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from "react-router-dom";
import ErrorPage from "./components/ErrorPage/ErrorPage.tsx";
import Loading from "./components/Loading/Loading.tsx";
import Login from "./components/Login/Login.tsx";
import Index from "./components/Dashboard/Dashboard.tsx";
import "./main.css";
import "./reset.css";

export const BASEURL = "http://localhost:3000";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Navigate to="/login" />,
	},
	{
		path: "/login",
		element: <Login />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/dashboard",
		element: <Index />,
		loader: async () => {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("No token available");
			}

			try {
				const response = await fetch(`${BASEURL}/conversations`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Failed to fetch conversations");
				}

				return response.json();
			} catch (error) {
				throw error;
			}
		},
		id: "conversations",
		errorElement: <ErrorPage />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider
			router={router}
			fallbackElement={<Loading />}
			future={{ v7_startTransition: true }}
		/>
	</React.StrictMode>
);
