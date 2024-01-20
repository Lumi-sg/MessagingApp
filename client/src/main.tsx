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
import Index from "./components/Index/Dashboard.tsx";
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
			// Step 1: Retrieve the token from local storage
			const token = localStorage.getItem("token"); // Replace with your actual storage key

			if (!token) {
				// Handle the case where the token is not available
				return Promise.reject("No token available");
			}

			// Step 2: Use the retrieved token in the fetch request
			const response = await fetch(`${BASEURL}/conversations`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				// Handle the case where the API call is not successful
				return Promise.reject("Failed to fetch conversations");
			}

			return response.json();
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
