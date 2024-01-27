import Footer from "../Footer/Footer";
import "./login.css";
import { BASEURL } from "../../main";
import { useUserStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User } from "../../types/User";

const Login = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const username = formData.get("username");
		const password = formData.get("password");

		try {
			const response = await fetch(`${BASEURL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				// Redirect to a new page upon successful login
				await useUserStore.getState().login(response);

			
				const allSiteUsers = (await response.json()) as User[];
				useUserStore.getState().setAllUsers(allSiteUsers);
				navigate("/dashboard");
			} else {
				console.error("Login failed");
				console.log(response);
				setError("Incorrect username/password");
			}
		} catch (error) {
			console.error("Login error:", error);
		}
	};
	return (
		<div className="mainContainer">
			<div className="loginContainer">
				<form onSubmit={handleSubmit} className="loginForm">
					<label htmlFor="username">Username:</label>
					<input type="text" id="username" name="username" required />
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						required
					/>
					<div className="buttonContainer">
						<button type="submit">Login</button>
						<button>Signup</button>
					</div>
					{error && <div style={{ color: "red" }}>{error}</div>}
				</form>
			</div>
			<Footer />
		</div>
	);
};

export default Login;
