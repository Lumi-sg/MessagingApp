import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Footer from "../Footer/Footer";

const ErrorPage = () => {
	const error = useRouteError();
	console.error(error);
	return (
		<div className="mainContainer">
			<div className="errorContainer">
				<h1>Oops!</h1>
				<p>Sorry, an unexpected error has occurred.</p>
				<p>
					<i>
						{isRouteErrorResponse(error)
							? error.status || error.statusText
							: "Unknown error message"}
					</i>
				</p>
			</div>
			<Footer />
		</div>
	);
};

export default ErrorPage;