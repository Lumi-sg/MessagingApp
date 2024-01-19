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
import "./main.css";
import "./reset.css";

export const BASEURL = "http://localhost:3000";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Navigate to="/index" />,
	},
	{
		path: "/index",
		element: <Login />,
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
